CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  user_id UUID NOT NULL,
  image_type TEXT NOT NULL,
  style_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  industry TEXT DEFAULT 'other'
);

-- Ensure the column has a default value
ALTER TABLE public.generated_images ALTER COLUMN is_public SET DEFAULT true;

-- Update existing records if needed (set to true for all existing if not set)
UPDATE public.generated_images SET is_public = true WHERE is_public IS NULL;