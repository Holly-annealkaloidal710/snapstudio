-- Fix profiles table RLS
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

CREATE POLICY "profiles_select_policy" ON public.profiles 
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles 
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Fix projects table RLS
DROP POLICY IF EXISTS "projects_policy" ON public.projects;

CREATE POLICY "projects_select_policy" ON public.projects 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_policy" ON public.projects 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_policy" ON public.projects 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_policy" ON public.projects 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix generated_images table RLS
DROP POLICY IF EXISTS "generated_images_policy" ON public.generated_images;

CREATE POLICY "generated_images_select_policy" ON public.generated_images 
FOR SELECT TO authenticated USING (
  auth.uid() = user_id OR is_public = true
);

CREATE POLICY "generated_images_insert_policy" ON public.generated_images 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "generated_images_update_policy" ON public.generated_images 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "generated_images_delete_policy" ON public.generated_images 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix orders table RLS
DROP POLICY IF EXISTS "orders_policy" ON public.orders;

CREATE POLICY "orders_select_policy" ON public.orders 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "orders_insert_policy" ON public.orders 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_policy" ON public.orders 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix notifications table RLS
DROP POLICY IF EXISTS "notifications_policy" ON public.notifications;

CREATE POLICY "notifications_select_policy" ON public.notifications 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_policy" ON public.notifications 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_update_policy" ON public.notifications 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_policy" ON public.notifications 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix points_ledger table RLS
DROP POLICY IF EXISTS "points_ledger_policy" ON public.points_ledger;

CREATE POLICY "points_ledger_select_policy" ON public.points_ledger 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "points_ledger_insert_policy" ON public.points_ledger 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix usage_logs table RLS
DROP POLICY IF EXISTS "usage_logs_policy" ON public.usage_logs;

CREATE POLICY "usage_logs_select_policy" ON public.usage_logs 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "usage_logs_insert_policy" ON public.usage_logs 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix community tables RLS
DROP POLICY IF EXISTS "community_likes_policy" ON public.community_likes;
DROP POLICY IF EXISTS "community_comments_policy" ON public.community_comments;

CREATE POLICY "community_likes_select_policy" ON public.community_likes 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "community_likes_insert_policy" ON public.community_likes 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_likes_delete_policy" ON public.community_likes 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "community_comments_select_policy" ON public.community_comments 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "community_comments_insert_policy" ON public.community_comments 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_comments_update_policy" ON public.community_comments 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "community_comments_delete_policy" ON public.community_comments 
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix user_follows table RLS
DROP POLICY IF EXISTS "user_follows_policy" ON public.user_follows;

CREATE POLICY "user_follows_select_policy" ON public.user_follows 
FOR SELECT TO authenticated USING (
  auth.uid() = follower_id OR auth.uid() = following_id
);

CREATE POLICY "user_follows_insert_policy" ON public.user_follows 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "user_follows_delete_policy" ON public.user_follows 
FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- Fix affiliates table RLS
DROP POLICY IF EXISTS "affiliates_policy" ON public.affiliates;

CREATE POLICY "affiliates_select_policy" ON public.affiliates 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "affiliates_insert_policy" ON public.affiliates 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "affiliates_update_policy" ON public.affiliates 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Fix affiliate_commissions table RLS
DROP POLICY IF EXISTS "affiliate_commissions_policy" ON public.affiliate_commissions;

CREATE POLICY "affiliate_commissions_select_policy" ON public.affiliate_commissions 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_commissions.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- Fix affiliate_payouts table RLS
DROP POLICY IF EXISTS "affiliate_payouts_policy" ON public.affiliate_payouts;

CREATE POLICY "affiliate_payouts_select_policy" ON public.affiliate_payouts 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_payouts.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

CREATE POLICY "affiliate_payouts_insert_policy" ON public.affiliate_payouts 
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_payouts.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- Fix renders table RLS
DROP POLICY IF EXISTS "renders_policy" ON public.renders;

CREATE POLICY "renders_select_policy" ON public.renders 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "renders_insert_policy" ON public.renders 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);