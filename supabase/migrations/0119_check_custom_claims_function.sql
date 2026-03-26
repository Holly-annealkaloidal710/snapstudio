-- Check xem custom claims function có được gọi không
SELECT 
  auth.jwt() as full_jwt,
  auth.jwt() -> 'app_metadata' as app_metadata,
  auth.jwt() -> 'app_metadata' ->> 'claims_admin' as claims_admin;