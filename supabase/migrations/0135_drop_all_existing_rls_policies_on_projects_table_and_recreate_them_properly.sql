-- Drop all existing policies on projects table
DROP POLICY IF EXISTS "Users can manage their own projects" ON public.projects;
DROP POLICY IF EXISTS "projects_own_access" ON public.projects;
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON public.projects;

-- Ensure RLS is enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for projects table
CREATE POLICY "projects_select_policy" ON public.projects 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_policy" ON public.projects 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_policy" ON public.projects 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_policy" ON public.projects 
FOR DELETE TO authenticated USING (auth.uid() = user_id);