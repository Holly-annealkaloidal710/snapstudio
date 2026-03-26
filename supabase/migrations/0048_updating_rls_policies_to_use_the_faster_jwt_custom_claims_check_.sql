-- Create a helper function to check for the admin claim in the JWT.
-- This is much faster than querying the profiles table every time.
CREATE OR REPLACE FUNCTION is_claims_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'claims_admin')::boolean
$$;

-- Update RLS policy for affiliates
DROP POLICY IF EXISTS admin_affiliates_all ON public.affiliates;
CREATE POLICY admin_affiliates_all ON public.affiliates
  FOR ALL
  USING (is_claims_admin())
  WITH CHECK (is_claims_admin());

-- Update RLS policy for renders
DROP POLICY IF EXISTS "Admin can view all renders" ON public.renders;
CREATE POLICY "Admin can view all renders" ON public.renders
  FOR ALL
  USING (is_claims_admin())
  WITH CHECK (is_claims_admin());

-- Update RLS policy for affiliate_commissions
DROP POLICY IF EXISTS admin_commissions_all ON public.affiliate_commissions;
CREATE POLICY admin_commissions_all ON public.affiliate_commissions
  FOR ALL
  USING (is_claims_admin())
  WITH CHECK (is_claims_admin());

-- Update RLS policy for affiliate_payouts
DROP POLICY IF EXISTS admin_payouts_all ON public.affiliate_payouts;
CREATE POLICY admin_payouts_all ON public.affiliate_payouts
  FOR ALL
  USING (is_claims_admin())
  WITH CHECK (is_claims_admin());