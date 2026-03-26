-- 1) Add points_balance to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS points_balance INTEGER NOT NULL DEFAULT 0;

-- 2) Create points_ledger table
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('purchase','generate_spend','refund','admin_adjust')),
  related_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

-- Policies: allow users to read their own ledger only
DROP POLICY IF EXISTS points_ledger_select_policy ON public.points_ledger;
CREATE POLICY points_ledger_select_policy ON public.points_ledger
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Intentionally NO INSERT/UPDATE/DELETE policies for authenticated users.
-- Inserts/updates will be performed by Edge Functions with service role, which bypasses RLS by design.