-- Check if RLS is enabled on these tables (without the non-existent forcerowsecurity column)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('projects', 'generated_images');