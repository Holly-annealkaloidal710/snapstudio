-- Kiểm tra user hiện tại
SELECT auth.uid() as current_user_id;

-- Kiểm tra có user nào trong auth.users không
SELECT id, email, created_at FROM auth.users LIMIT 5;