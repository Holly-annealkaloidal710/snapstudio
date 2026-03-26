-- Check RLS policies on projects and generated_images tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('projects', 'generated_images')
ORDER BY tablename, policyname;