-- Test query với RLS enabled
SELECT id, name, user_id, created_at
FROM projects 
ORDER BY created_at DESC 
LIMIT 5;