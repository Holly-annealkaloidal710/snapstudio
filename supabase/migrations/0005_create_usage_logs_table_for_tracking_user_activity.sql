-- Create usage_logs table
CREATE TABLE public.usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('image_generated', 'image_downloaded', 'project_created')),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own usage logs" ON public.usage_logs 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage logs" ON public.usage_logs 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);