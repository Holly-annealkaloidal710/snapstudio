-- Create renders table
CREATE TABLE public.renders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
  mode TEXT NOT NULL CHECK (mode IN ('fast', 'slow', 'batch', 'solo')),
  images_generated INTEGER DEFAULT 1 NOT NULL CHECK (images_generated > 0),
  prompt_tokens INTEGER DEFAULT 0,
  candidates_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  unit_price_usd DECIMAL(10,6) NOT NULL,
  cost_usd DECIMAL(10,6) NOT NULL,
  cost_vnd DECIMAL(12,0) NOT NULL,
  points_spent INTEGER DEFAULT 0 NOT NULL,
  revenue_usd DECIMAL(10,6) DEFAULT 0,
  prompt_used TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.renders ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own renders
CREATE POLICY "Users can view their own renders" ON public.renders
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own renders" ON public.renders
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admin can view all (for reporting)
CREATE POLICY "Admin can view all renders" ON public.renders
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.subscription_plan = 'admin'
  )
);