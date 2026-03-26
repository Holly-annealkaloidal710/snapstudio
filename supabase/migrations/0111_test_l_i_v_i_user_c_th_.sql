-- Test query với user ID cụ thể
SET LOCAL role = 'authenticated';
SET LOCAL request.jwt.claims = '{"sub": "ef30e13b-cb76-4164-a200-bd464b5d4764"}';

-- Test select projects
SELECT id, name, user_id, created_at 
FROM projects 
WHERE user_id = 'ef30e13b-cb76-4164-a200-bd464b5d4764'
ORDER BY created_at DESC 
LIMIT 5;