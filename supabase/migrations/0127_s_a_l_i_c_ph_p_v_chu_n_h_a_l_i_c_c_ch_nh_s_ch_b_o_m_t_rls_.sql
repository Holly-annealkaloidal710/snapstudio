-- Xóa tất cả các policy cũ trên các bảng chính để dọn dẹp
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read_community" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_select_own" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;
DROP POLICY IF EXISTS "projects_update_own" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_own" ON public.projects;

DROP POLICY IF EXISTS "images_select_own" ON public.generated_images;
DROP POLICY IF EXISTS "images_insert_own" ON public.generated_images;
DROP POLICY IF EXISTS "images_update_own" ON public.generated_images;
DROP POLICY IF EXISTS "images_delete_own" ON public.generated_images;
DROP POLICY IF EXISTS "images_public_anonymous" ON public.generated_images;

DROP POLICY IF EXISTS "community_comments_read" ON public.community_comments;
DROP POLICY IF EXISTS "community_comments_write" ON public.community_comments;
DROP POLICY IF EXISTS "community_comments_update" ON public.community_comments;
DROP POLICY IF EXISTS "community_comments_delete" ON public.community_comments;
DROP POLICY IF EXISTS "Users can manage their own comments" ON public.community_comments;


DROP POLICY IF EXISTS "community_likes_read" ON public.community_likes;
DROP POLICY IF EXISTS "community_likes_write" ON public.community_likes;
DROP POLICY IF EXISTS "community_likes_delete" ON public.community_likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.community_likes;


-- TẠO LẠI POLICY MỚI, ĐƠN GIẢN VÀ AN TOÀN

-- Bảng `profiles`
CREATE POLICY "Users can manage their own profile" ON public.profiles
FOR ALL TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view profiles" ON public.profiles
FOR SELECT USING (true);

-- Bảng `projects` (Dữ liệu riêng tư)
CREATE POLICY "Users can manage their own projects" ON public.projects
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Bảng `generated_images` (Dữ liệu có thể công khai)
CREATE POLICY "Public can read public images" ON public.generated_images
FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own images" ON public.generated_images
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Bảng `community_comments`
CREATE POLICY "Anyone can read comments" ON public.community_comments
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON public.community_comments
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.community_comments
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.community_comments
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Bảng `community_likes`
CREATE POLICY "Anyone can read likes" ON public.community_likes
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON public.community_likes
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON public.community_likes
FOR DELETE TO authenticated
USING (auth.uid() = user_id);