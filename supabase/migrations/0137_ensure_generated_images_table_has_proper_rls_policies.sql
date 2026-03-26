-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own images" ON public.generated_images;
DROP POLICY IF EXISTS "Public can read public images" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_select_policy" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_insert_policy" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_update_policy" ON public.generated_images;
DROP POLICY IF EXISTS "generated_images_delete_policy" ON public.generated_images;

-- Ensure RLS is enabled
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for generated_images table
CREATE POLICY "generated_images_select_own" ON public.generated_images 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "generated_images_select_public" ON public.generated_images 
FOR SELECT USING (is_public = true);

CREATE POLICY "generated_images_insert_policy" ON public.generated_images 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "generated_images_update_policy" ON public.generated_images 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "generated_images_delete_policy" ON public.generated_images 
FOR DELETE TO authenticated USING (auth.uid() = user_id);