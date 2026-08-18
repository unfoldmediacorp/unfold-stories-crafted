-- Allow the anon (publishable-key) client to submit contact-form enquiries
-- directly, without a service-role credential. INSERT only: no SELECT/UPDATE/
-- DELETE policy is added for anon, so submitted enquiries remain unreadable
-- and unmodifiable via the publishable key. The existing service-role policy
-- is untouched.
CREATE POLICY "Anonymous users can submit enquiries"
ON public.enquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Defense-in-depth: mirror the structural bounds already enforced by the
-- application's Zod schema (src/routes/api/contact.ts) at the database
-- level, in case a caller reaches the anon INSERT policy directly instead
-- of through /api/contact. No email format/regex check here, per Zod
-- remaining the single source of truth for format validation.
ALTER TABLE public.enquiries
  ADD CONSTRAINT enquiries_email_length CHECK (char_length(email) BETWEEN 1 AND 255),
  ADD CONSTRAINT enquiries_company_length CHECK (company IS NULL OR char_length(company) <= 100),
  ADD CONSTRAINT enquiries_phone_length CHECK (phone IS NULL OR char_length(phone) <= 50),
  ADD CONSTRAINT enquiries_brief_length CHECK (char_length(brief) BETWEEN 1 AND 2000);
