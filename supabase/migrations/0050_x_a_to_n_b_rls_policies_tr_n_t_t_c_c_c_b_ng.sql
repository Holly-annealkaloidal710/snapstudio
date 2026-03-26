-- Xóa policies trên bảng profiles
DROP POLICY IF EXISTS profiles_select_policy ON profiles;
DROP POLICY IF EXISTS profiles_insert_policy ON profiles;
DROP POLICY IF EXISTS profiles_update_policy ON profiles;
DROP POLICY IF EXISTS profiles_delete_policy ON profiles;

-- Xóa policies trên bảng projects
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Xóa policies trên bảng generated_images
DROP POLICY IF EXISTS "Users can view their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can create their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can update their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Users can delete their own generated images" ON generated_images;
DROP POLICY IF EXISTS "Public can view public generated images" ON generated_images;
DROP POLICY IF EXISTS "Anyone can view sample images" ON generated_images;

-- Xóa policies trên bảng orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;

-- Xóa policies trên bảng prompt_templates
DROP POLICY IF EXISTS "Prompt templates are viewable by everyone" ON prompt_templates;

-- Xóa policies trên bảng usage_logs
DROP POLICY IF EXISTS "Users can view their own usage logs" ON usage_logs;
DROP POLICY IF EXISTS "Users can create their own usage logs" ON usage_logs;

-- Xóa policies trên bảng points_ledger
DROP POLICY IF EXISTS points_ledger_select_policy ON points_ledger;

-- Xóa policies trên bảng affiliates
DROP POLICY IF EXISTS affiliates_select_own ON affiliates;
DROP POLICY IF EXISTS affiliates_insert_own ON affiliates;
DROP POLICY IF EXISTS affiliates_update_own ON affiliates;
DROP POLICY IF EXISTS admin_affiliates_all ON affiliates;

-- Xóa policies trên bảng affiliate_commissions
DROP POLICY IF EXISTS commissions_select_own ON affiliate_commissions;
DROP POLICY IF EXISTS admin_commissions_all ON affiliate_commissions;

-- Xóa policies trên bảng affiliate_payouts
DROP POLICY IF EXISTS payouts_select_own ON affiliate_payouts;
DROP POLICY IF EXISTS admin_payouts_all ON affiliate_payouts;

-- Xóa policies trên bảng community_likes
DROP POLICY IF EXISTS "Anyone can read likes" ON community_likes;
DROP POLICY IF EXISTS "Users can like images" ON community_likes;
DROP POLICY IF EXISTS "Users can unlike their likes" ON community_likes;

-- Xóa policies trên bảng community_comments
DROP POLICY IF EXISTS "Anyone can read comments" ON community_comments;
DROP POLICY IF EXISTS "Users can comment" ON community_comments;
DROP POLICY IF EXISTS "Users can delete their comments" ON community_comments;

-- Xóa policies trên bảng user_follows
DROP POLICY IF EXISTS user_follows_insert_own ON user_follows;
DROP POLICY IF EXISTS user_follows_select_own ON user_follows;
DROP POLICY IF EXISTS user_follows_delete_own ON user_follows;

-- Xóa policies trên bảng renders
DROP POLICY IF EXISTS "Users can view their own renders" ON renders;
DROP POLICY IF EXISTS "Users can insert their own renders" ON renders;
DROP POLICY IF EXISTS "Admin can view all renders" ON renders;

-- Xóa policies trên bảng notifications
DROP POLICY IF EXISTS "Users can manage their own notifications" ON notifications;