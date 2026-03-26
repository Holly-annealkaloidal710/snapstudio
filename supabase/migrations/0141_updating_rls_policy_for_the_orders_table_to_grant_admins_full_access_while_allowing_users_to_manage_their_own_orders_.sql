DROP POLICY IF EXISTS orders_user_access ON public.orders;

CREATE POLICY "Allow full access for admins and own-data access for users"
ON public.orders
FOR ALL
USING (
  (auth.uid() = user_id) OR (is_claims_admin())
)
WITH CHECK (
  (auth.uid() = user_id) OR (is_claims_admin())
);