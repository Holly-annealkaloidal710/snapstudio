-- Check current policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop existing problematic policies
DROP POLICY IF EXISTS "profiles_own_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;

-- Create new, correct policies
CREATE POLICY "profiles_select_own" ON public.profiles 
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles 
FOR DELETE TO authenticated USING (auth.uid() = id);

-- Allow public read for profiles that have public images (for community features)
CREATE POLICY "profiles_public_read_community" ON public.profiles 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM generated_images 
    WHERE generated_images.user_id = profiles.id 
    AND generated_images.is_public = true
  )
);