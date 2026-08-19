-- Defense-in-depth: the anon INSERT policy on public.enquiries is reachable
-- directly via the Supabase REST API using the public publishable key,
-- bypassing /api/contact's Zod validation entirely (see
-- 20260818124430_62d473ae-5541-4d03-8ac2-5213e38e8aea.sql, which added the
-- same CHECK constraints for email/company/phone/brief for exactly this
-- reason). That migration mirrored every Zod-enforced length bound except
-- `name` (Zod max 100) -- this fills that gap. No format check, per the
-- same rationale: Zod remains the single source of truth for format.
ALTER TABLE public.enquiries
  ADD CONSTRAINT enquiries_name_length CHECK (char_length(name) BETWEEN 1 AND 100);
