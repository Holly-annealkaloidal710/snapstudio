-- Drop existing policies on the profiles table to ensure a clean slate
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_read_community" ON public.profiles;

-- Recreate policies with correct and secure definitions

-- 1. Users can view their own profile.
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- 2. Users can insert their own profile.
-- This is mainly handled by the handle_new_user trigger, but this policy provides a fallback
-- and ensures security if direct inserts are attempted.
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile.
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Users can delete their own profile.
CREATE POLICY "profiles_delete_own" ON public.profiles
FOR DELETE TO authenticated
USING (auth.uid() = id);

-- 5. Allow public read access for profiles that have public images (for community page)
CREATE POLICY "profiles_public_read_community" ON public.profiles
FOR SELECT USING (
  (EXISTS (
    SELECT 1
    FROM generated_images
    WHERE (
      (generated_images.user_id = profiles.id) AND (generated_images.is_public = true)
    )
  ))
);