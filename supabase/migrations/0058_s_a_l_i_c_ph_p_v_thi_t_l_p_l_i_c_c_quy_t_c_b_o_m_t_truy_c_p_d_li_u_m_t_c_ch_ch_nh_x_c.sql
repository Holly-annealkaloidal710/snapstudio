-- Bắt đầu bằng cách xóa tất cả các chính sách RLS hiện có trên các bảng chính để đảm bảo một khởi đầu sạch sẽ.
DO $$
DECLARE
    r RECORD;
    tables_to_reset TEXT[] := ARRAY[
        'profiles', 'projects', 'generated_images', 'orders', 'notifications',
        'points_ledger', 'usage_logs', 'community_likes', 'community_comments',
        'user_follows', 'affiliates', 'affiliate_commissions', 'affiliate_payouts', 'renders'
    ];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY tables_to_reset
    LOOP
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = tbl) LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public."' || tbl || '";';
        END LOOP;
    END LOOP;
END $$;

-- Bây giờ, tạo lại các chính sách RLS thiết yếu với logic chính xác.

-- Bảng: profiles
CREATE POLICY "profiles_access_policy" ON public.profiles
    FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Bảng: projects
CREATE POLICY "projects_access_policy" ON public.projects
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bảng: generated_images
CREATE POLICY "generated_images_select_policy" ON public.generated_images
    FOR SELECT USING ((is_public = true) OR (auth.uid() = user_id));
CREATE POLICY "generated_images_insert_policy" ON public.generated_images
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "generated_images_update_policy" ON public.generated_images
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "generated_images_delete_policy" ON public.generated_images
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Bảng: orders
CREATE POLICY "orders_access_policy" ON public.orders
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bảng: notifications
CREATE POLICY "notifications_access_policy" ON public.notifications
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bảng: points_ledger
CREATE POLICY "points_ledger_select_policy" ON public.points_ledger
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Bảng: usage_logs
CREATE POLICY "usage_logs_select_policy" ON public.usage_logs
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Bảng: community_likes
CREATE POLICY "community_likes_select_policy" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "community_likes_insert_policy" ON public.community_likes
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_likes_delete_policy" ON public.community_likes
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Bảng: community_comments
CREATE POLICY "community_comments_select_policy" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "community_comments_manage_policy" ON public.community_comments
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bảng: user_follows
CREATE POLICY "user_follows_select_policy" ON public.user_follows FOR SELECT USING (true);
CREATE POLICY "user_follows_insert_policy" ON public.user_follows
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "user_follows_delete_policy" ON public.user_follows
    FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- Bảng: affiliates
CREATE POLICY "affiliates_access_policy" ON public.affiliates
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Bảng: affiliate_commissions
CREATE POLICY "affiliate_commissions_select_policy" ON public.affiliate_commissions
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a
            WHERE a.id = affiliate_id AND a.user_id = auth.uid()
        )
    );

-- Bảng: affiliate_payouts
CREATE POLICY "affiliate_payouts_select_policy" ON public.affiliate_payouts
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.affiliates a
            WHERE a.id = affiliate_id AND a.user_id = auth.uid()
        )
    );

-- Bảng: renders
CREATE POLICY "renders_select_policy" ON public.renders
    FOR SELECT TO authenticated USING (auth.uid() = user_id);