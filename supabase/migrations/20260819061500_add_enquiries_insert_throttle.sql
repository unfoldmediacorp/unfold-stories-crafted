-- Defense-in-depth: public.enquiries' anon INSERT policy (WITH CHECK (true))
-- is reachable directly via the Supabase REST API using the public
-- publishable key, bypassing /api/contact entirely -- and with it, the
-- in-memory rate limiter, honeypot, and .strict() Zod schema in
-- src/lib/rate-limit.ts / src/routes/api/contact.ts.
--
-- This mirrors that app-layer GLOBAL limiter (20 requests / 60s, see
-- GLOBAL_WINDOW_MS/GLOBAL_MAX_REQUESTS in src/lib/rate-limit.ts) at the
-- database layer, so a caller bypassing the app is still bounded.
--
-- Deliberately NOT per-IP: PostgREST does not expose the caller's IP to a
-- trigger without extra configuration this project doesn't have, so this
-- cannot replicate the app's per-IP limit -- only its global one. That is
-- an accepted, documented limitation, not an oversight (see F-06 in
-- SECURITY_AUDIT.md on per-process vs. distributed rate limiting).
--
-- Coarse by design: legitimate traffic at this site's scale (a small
-- studio's contact form) will never approach 20 inserts/minute, so no
-- false positives are expected. The trigger fires for every role, including
-- service_role -- there is no code path that uses service_role to write to
-- this table today (see SECURITY_AUDIT.md F-05), but if that ever changes
-- and needs to bypass this throttle (e.g. a manual bulk backfill), run:
--   ALTER TABLE public.enquiries DISABLE TRIGGER enquiries_insert_throttle;
-- and re-enable it afterwards.

-- Singleton control row. The boolean primary key + CHECK forces at most one
-- row to ever exist.
CREATE TABLE public._enquiries_insert_throttle (
  id boolean PRIMARY KEY DEFAULT true,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0,
  CONSTRAINT _enquiries_insert_throttle_single_row CHECK (id)
);

INSERT INTO public._enquiries_insert_throttle (id, window_start, count)
VALUES (true, now(), 0);

-- No grants to anon/authenticated and RLS with zero policies (default
-- deny): only the SECURITY DEFINER function below, owned by the table
-- owner, can read or write this table. Matches the deny-by-default pattern
-- already used for public.enquiries itself.
ALTER TABLE public._enquiries_insert_throttle ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.enforce_enquiries_insert_throttle()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  window_seconds constant integer := 60;
  max_per_window constant integer := 20;
  current_row public._enquiries_insert_throttle%ROWTYPE;
BEGIN
  SELECT * INTO current_row
  FROM public._enquiries_insert_throttle
  WHERE id = true
  FOR UPDATE;

  IF now() - current_row.window_start >= make_interval(secs => window_seconds) THEN
    UPDATE public._enquiries_insert_throttle
    SET window_start = now(), count = 1
    WHERE id = true;
  ELSIF current_row.count >= max_per_window THEN
    -- PostgREST maps a 5-char SQLSTATE of the form PTxxx directly to HTTP
    -- status xxx, so the anon REST caller sees a 429 (matching the app's
    -- own rate-limit response) instead of a generic 400.
    RAISE EXCEPTION 'Too many enquiries submitted. Please try again shortly.'
      USING ERRCODE = 'PT429';
  ELSE
    UPDATE public._enquiries_insert_throttle
    SET count = current_row.count + 1
    WHERE id = true;
  END IF;

  RETURN NEW;
END;
$$;

-- SECURITY DEFINER functions run with the owner's privileges, so they must
-- not be directly callable by anon/authenticated outside of the trigger
-- context; a trigger invocation is not a grantable EXECUTE, but this closes
-- the (already-default-denied-by-lack-of-grant) direct-call path too.
REVOKE ALL ON FUNCTION public.enforce_enquiries_insert_throttle() FROM PUBLIC;

CREATE TRIGGER enquiries_insert_throttle
  BEFORE INSERT ON public.enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_enquiries_insert_throttle();
