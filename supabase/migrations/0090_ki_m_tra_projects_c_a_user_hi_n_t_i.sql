SELECT id, name, user_id, created_at 
FROM projects 
WHERE user_id = auth.uid()
LIMIT 10;