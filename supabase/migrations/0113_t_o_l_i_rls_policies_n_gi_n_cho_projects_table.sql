-- Xóa tất cả policies cũ trên projects
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;

-- Tạo policy đơn giản nhất cho SELECT
CREATE POLICY "projects_select_policy" ON projects 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Test ngay policy này
SELECT auth.uid() as current_user_id;