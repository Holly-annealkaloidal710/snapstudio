-- Xóa tất cả policies cũ trước
DROP POLICY IF EXISTS "projects_user_access" ON projects;
DROP POLICY IF EXISTS "images_user_access" ON generated_images;
DROP POLICY IF EXISTS "images_public_read" ON generated_images;
DROP POLICY IF EXISTS "projects_select_own" ON projects;
DROP POLICY IF EXISTS "projects_insert_own" ON projects;
DROP POLICY IF EXISTS "projects_update_own" ON projects;
DROP POLICY IF EXISTS "projects_delete_own" ON projects;
DROP POLICY IF EXISTS "images_select_own" ON generated_images;
DROP POLICY IF EXISTS "images_insert_own" ON generated_images;
DROP POLICY IF EXISTS "images_update_own" ON generated_images;
DROP POLICY IF EXISTS "images_delete_own" ON generated_images;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Tạo policies mới đơn giản
CREATE POLICY "projects_user_access" ON projects 
FOR ALL TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "images_user_access" ON generated_images
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "images_public_read" ON generated_images
FOR SELECT TO public
USING (is_public = true);