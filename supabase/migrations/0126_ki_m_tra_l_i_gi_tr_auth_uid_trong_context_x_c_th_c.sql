SELECT id, user_id, auth.uid() as current_uid
FROM projects
LIMIT 5;