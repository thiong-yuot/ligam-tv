-- Add user_id column to job_applications for proper RLS
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop the insecure email-matching policy
DROP POLICY IF EXISTS "Users can view own applications" ON public.job_applications;

-- Create proper RLS policies
-- Users can only view their own applications (by user_id)
CREATE POLICY "Users can view own applications"
ON public.job_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.job_applications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update insert policy to require user_id
DROP POLICY IF EXISTS "Anyone can apply" ON public.job_applications;

CREATE POLICY "Authenticated users can apply"
ON public.job_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);