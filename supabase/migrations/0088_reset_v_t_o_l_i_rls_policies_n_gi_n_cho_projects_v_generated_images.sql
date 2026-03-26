-- Xóa tất cả policies cũ
DROP POLICY IF EXISTS "projects_own_access" ON projects;
DROP POLICY IF EXISTS "images_own_access" ON generated_images;
DROP POLICY IF EXISTS "images_public_read" ON generated_images;
DROP POLICY IF EXISTS "images_anonymous_public" ON generated_images;

-- Tạo lại policies đơn giản cho projects
CREATE POLICY "projects_select_own" ON projects 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own" ON projects 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own" ON projects 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_own" ON projects 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tạo lại policies đơn giản cho generated_images
CREATE POLICY "images_select_own" ON generated_images 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "images_insert_own" ON generated_images 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "images_update_own" ON generated_images 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "images_delete_own" ON generated_images 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Thêm policy cho public images (ai cũng đọc được nếu is_public = true)
CREATE POLICY "images_public_read" ON generated_images 
FOR SELECT USING (is_public = true);

-- Cho phép anonymous users đọc public images
CREATE POLICY "images_anonymous_public" ON generated_images 
FOR SELECT TO anon USING (is_public = true);