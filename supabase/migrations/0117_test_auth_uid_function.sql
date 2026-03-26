-- Test xem auth.uid() có hoạt động không
SELECT 
  auth.uid() as current_user_id,
  current_user as session_user,
  current_setting('request.jwt.claims', true)::json as jwt_claims;