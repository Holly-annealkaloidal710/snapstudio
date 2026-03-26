-- Kiểm tra tất cả projects trong database
SELECT id, user_id, name, created_at FROM projects ORDER BY created_at DESC LIMIT 10;

-- Kiểm tra projects của user cụ thể (thay YOUR_USER_ID)
SELECT id, user_id, name, created_at 
FROM projects 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-admin@example.com')
ORDER BY created_at DESC;