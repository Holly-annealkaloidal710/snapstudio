-- Xem policies hiện tại
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('projects', 'generated_images');

-- Kiểm tra RLS có enable không
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('projects', 'generated_images');