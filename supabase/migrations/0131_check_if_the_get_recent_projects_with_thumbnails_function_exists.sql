SELECT proname, proowner, proacl 
FROM pg_proc 
WHERE proname = 'get_recent_projects_with_thumbnails';