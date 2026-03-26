DO $$
DECLARE
    old_user_id UUID := 'ef30e13b-a773-42d1-9123-5113543f1212';
    new_user_id UUID := auth.uid();
BEGIN
    -- Update all tables that reference the user ID
    UPDATE public.projects SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.generated_images SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.usage_logs SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.orders SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.affiliates SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.affiliate_commissions SET referred_user_id = new_user_id WHERE referred_user_id = old_user_id;
    UPDATE public.community_comments SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.renders SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.notifications SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.points_ledger SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.community_likes SET user_id = new_user_id WHERE user_id = old_user_id;
    UPDATE public.user_follows SET follower_id = new_user_id WHERE follower_id = old_user_id;
    UPDATE public.user_follows SET following_id = new_user_id WHERE following_id = old_user_id;
END $$;