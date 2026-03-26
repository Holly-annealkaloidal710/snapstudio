-- Test query to see if authenticated users can access their projects
SELECT COUNT(*) as project_count 
FROM public.projects 
WHERE user_id = auth.uid();