SELECT id, user_id, name, created_at 
FROM projects 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-admin@example.com')
ORDER BY created_at DESC;