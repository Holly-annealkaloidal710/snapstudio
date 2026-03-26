-- Create generated_images table
CREATE TABLE public.generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_type TEXT NOT NULL CHECK (image_type IN ('display', 'model', 'social', 'seeding')),
  style_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own generated images" ON public.generated_images 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated images" ON public.generated_images 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated images" ON public.generated_images 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated images" ON public.generated_images 
FOR DELETE TO authenticated USING (auth.uid() = user_id);