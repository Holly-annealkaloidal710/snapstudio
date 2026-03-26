-- Check if generated_images policies exist and are correct
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'generated_images';