-- Xóa policy cũ nếu có để tránh xung đột
DROP POLICY IF EXISTS "profiles_own_access" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

-- Tạo lại policy đúng: User có thể xem, tạo, sửa, xóa profile của chính mình
CREATE POLICY "profiles_own_access"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Đảm bảo RLS được bật
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;