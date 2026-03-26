-- Enable RLS lại
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Tạo policy đơn giản cho SELECT
CREATE POLICY "projects_select_own" ON projects 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Tạo policy cho INSERT
CREATE POLICY "projects_insert_own" ON projects 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Tạo policy cho UPDATE
CREATE POLICY "projects_update_own" ON projects 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

-- Tạo policy cho DELETE
CREATE POLICY "projects_delete_own" ON projects 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);