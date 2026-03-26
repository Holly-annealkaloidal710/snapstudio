-- Lấy user ID của your-admin@example.com
SELECT id FROM auth.users WHERE email = 'your-admin@example.com';

-- Test query projects trực tiếp
SELECT COUNT(*) as total_projects FROM projects;
SELECT COUNT(*) as user_projects FROM projects WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-admin@example.com');