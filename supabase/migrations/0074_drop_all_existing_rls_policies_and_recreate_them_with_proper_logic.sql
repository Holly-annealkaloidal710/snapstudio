-- Drop all existing policies first
DROP POLICY IF EXISTS "profiles_access_policy" ON public.profiles;
DROP POLICY IF EXISTS "projects_simple_policy" ON public.projects;
DROP POLICY IF EXISTS "generated_images_select_policy" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_insert_policy" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_update_policy" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_delete_policy" ON public.generated_images;
DROP POLICY IF EXISTS "orders_access_policy" ON public.orders;
DROP POLICY IF EXISTS "notifications_access_policy" ON public.notifications;
DROP POLICY IF EXISTS "points_ledger_select_policy" ON public.points_ledger;
DROP POLICY IF EXISTS "usage_logs_select_policy" ON public.usage_logs;
DROP POLICY IF EXISTS "community_likes_select_policy" ON public.community_likes;
DROP POLICY IF EXISTS "community_likes_insert_policy" ON public.community_likes;
DROP POLICY IF EXISTS "community_likes_delete_policy" ON public.community_likes;
DROP POLICY IF EXISTS "community_comments_select_policy" ON public.community_comments;
DROP POLICY IF EXISTS "community_comments_manage_policy" ON public.community_comments;
DROP POLICY IF EXISTS "user_follows_select_policy" ON public.user_follows;
DROP POLICY IF EXISTS "user_follows_insert_policy" ON public.user_follows;
DROP POLICY IF EXISTS "user_follows_delete_policy" ON public.user_follows;
DROP POLICY IF EXISTS "affiliates_access_policy" ON public.affiliates;
DROP POLICY IF EXISTS "affiliate_commissions_select_policy" ON public.affiliate_commissions;
DROP POLICY IF EXISTS "affiliate_payouts_select_policy" ON public.affiliate_payouts;
DROP POLICY IF EXISTS "renders_select_policy" ON public.renders;

-- =====================================================
-- 1. PROFILES TABLE
-- Users can see their own profile + profiles of users who have public images
-- =====================================================

CREATE POLICY "profiles_own_access" ON public.profiles
FOR ALL TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "profiles_public_read" ON public.profiles
FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.generated_images 
    WHERE user_id = profiles.id AND is_public = true
  )
);

-- =====================================================
-- 2. PROJECTS TABLE  
-- Users can only access their own projects
-- =====================================================

CREATE POLICY "projects_own_access" ON public.projects
FOR ALL TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. GENERATED IMAGES TABLE
-- Users see their own images + public images from others
-- =====================================================

CREATE POLICY "images_own_access" ON public.generated_images
FOR ALL TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "images_public_read" ON public.generated_images
FOR SELECT TO authenticated 
USING (is_public = true);

-- Allow anonymous users to see public images (for landing page)
CREATE POLICY "images_anonymous_public" ON public.generated_images
FOR SELECT TO anon 
USING (is_public = true);

-- =====================================================
-- 4. PERSONAL DATA TABLES
-- Users can only access their own data
-- =====================================================

CREATE POLICY "orders_own_access" ON public.orders
FOR ALL TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_own_access" ON public.notifications
FOR ALL TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "points_ledger_own_access" ON public.points_ledger
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "usage_logs_own_access" ON public.usage_logs
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "renders_own_access" ON public.renders
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- =====================================================
-- 5. COMMUNITY INTERACTION TABLES
-- Public read, authenticated write with ownership
-- =====================================================

-- Community Likes
CREATE POLICY "community_likes_read" ON public.community_likes
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "community_likes_write" ON public.community_likes
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_likes_delete" ON public.community_likes
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- Community Comments  
CREATE POLICY "community_comments_read" ON public.community_comments
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "community_comments_write" ON public.community_comments
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_comments_update" ON public.community_comments
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_comments_delete" ON public.community_comments
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- User Follows
CREATE POLICY "user_follows_read" ON public.user_follows
FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "user_follows_write" ON public.user_follows
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "user_follows_delete" ON public.user_follows
FOR DELETE TO authenticated 
USING (auth.uid() = follower_id);

-- =====================================================
-- 6. AFFILIATE SYSTEM
-- Users can only access their own affiliate data
-- =====================================================

CREATE POLICY "affiliates_own_access" ON public.affiliates
FOR ALL TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "affiliate_commissions_own_access" ON public.affiliate_commissions
FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE id = affiliate_commissions.affiliate_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "affiliate_payouts_own_access" ON public.affiliate_payouts
FOR ALL TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE id = affiliate_payouts.affiliate_id 
    AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE id = affiliate_payouts.affiliate_id 
    AND user_id = auth.uid()
  )
);

-- =====================================================
-- 7. PROMPT TEMPLATES (PUBLIC READ)
-- Everyone can read templates, only admin can modify
-- =====================================================

CREATE POLICY "prompt_templates_read" ON public.prompt_templates
FOR SELECT TO authenticated 
USING (true);

-- Allow anonymous users to read templates (for landing page)
CREATE POLICY "prompt_templates_anonymous" ON public.prompt_templates
FOR SELECT TO anon 
USING (is_active = true);