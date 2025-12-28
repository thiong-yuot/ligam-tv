-- Drop the existing admin-only SELECT policy and recreate with explicit denial for others
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contact_submissions;

-- Create explicit policy: Only admins can SELECT contact submissions
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add explicit policy for anonymous users (deny all)
CREATE POLICY "Anonymous users cannot view contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);