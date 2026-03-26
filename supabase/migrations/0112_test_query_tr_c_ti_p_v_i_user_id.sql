-- Test query trực tiếp với user ID cụ thể
SELECT id, name, user_id, created_at 
FROM projects 
WHERE user_id = 'ef30e13b-cb76-4164-a200-bd464b5d4764'
ORDER BY created_at DESC 
LIMIT 5;