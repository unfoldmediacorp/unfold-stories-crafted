-- Follow-up to 20260818132446_tighten_enquiries_grants.sql: that migration
-- revoked SELECT/UPDATE/DELETE from anon and left it with INSERT, but did
-- not touch REFERENCES/TRIGGER/TRUNCATE, which anon still held from
-- Supabase's default table grants. None of these are exploitable via
-- PostgREST (which only issues SELECT/INSERT/UPDATE/DELETE), but they are
-- unnecessary privileges on a table anon should only be able to INSERT
-- into, so this closes the gap for defense-in-depth completeness.
REVOKE REFERENCES, TRIGGER, TRUNCATE ON public.enquiries FROM anon;
