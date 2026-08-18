-- Defense-in-depth: RLS already restricts public.enquiries to anon INSERT
-- only (no SELECT/UPDATE/DELETE policy exists for anon, and no policy at
-- all exists for authenticated), but Supabase's default privileges grant
-- broad table-level access to anon/authenticated independent of RLS. This
-- narrows the table-level grants to match what RLS already intends, so
-- access is denied at two independent layers instead of relying on RLS
-- alone. Additive only: no data is touched, no existing policy is changed.
REVOKE ALL ON public.enquiries FROM authenticated;
REVOKE SELECT, UPDATE, DELETE ON public.enquiries FROM anon;
GRANT INSERT ON public.enquiries TO anon;
