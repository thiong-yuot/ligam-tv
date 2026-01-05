-- Fix 1: profiles table - require authentication for viewing profiles
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users only"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Fix 2: job_applications - ensure anonymous users cannot access
-- First drop existing conflicting policies
DROP POLICY IF EXISTS "Admins can view all applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Authenticated users can apply" ON public.job_applications;
DROP POLICY IF EXISTS "Users can create job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can view own job applications" ON public.job_applications;

-- Recreate with proper authentication requirements
CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can apply"
ON public.job_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());