SELECT COUNT(*) as total_projects FROM projects;
SELECT COUNT(*) as user_projects FROM projects WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-admin@example.com');