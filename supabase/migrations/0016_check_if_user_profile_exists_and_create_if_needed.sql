-- Check if your profile exists
SELECT * FROM profiles WHERE email = 'your-admin@example.com';

-- If no profile exists, let's check the auth.users table
SELECT id, email, created_at FROM auth.users WHERE email = 'your-admin@example.com';