DROP POLICY IF EXISTS profiles_all_access ON public.profiles;

CREATE POLICY "Allow full access for admins and own-profile access for users"
ON public.profiles
FOR ALL
USING (
  (auth.uid() = id) OR (is_claims_admin())
)
WITH CHECK (
  (auth.uid() = id) OR (is_claims_admin())
);