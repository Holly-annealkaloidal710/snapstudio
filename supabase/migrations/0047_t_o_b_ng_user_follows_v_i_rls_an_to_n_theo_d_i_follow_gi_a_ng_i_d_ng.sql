-- Create table
CREATE TABLE IF NOT EXISTS public.user_follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
);

-- Enable RLS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Policies
-- Chỉ xem các follow do chính mình thực hiện
CREATE POLICY user_follows_select_own
ON public.user_follows
FOR SELECT
TO authenticated
USING (auth.uid() = follower_id);

-- Chỉ cho insert với follower_id là chính mình
CREATE POLICY user_follows_insert_own
ON public.user_follows
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = follower_id AND follower_id <> following_id);

-- Chỉ cho delete với follower_id là chính mình
CREATE POLICY user_follows_delete_own
ON public.user_follows
FOR DELETE
TO authenticated
USING (auth.uid() = follower_id);