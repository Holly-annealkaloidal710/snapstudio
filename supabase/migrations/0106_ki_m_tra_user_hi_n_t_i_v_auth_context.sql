SELECT auth.uid() as current_user_id;
SELECT id, email, created_at FROM auth.users WHERE email = 'your-admin@example.com';