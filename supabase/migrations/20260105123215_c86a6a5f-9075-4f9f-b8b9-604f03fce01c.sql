-- Drop all existing policies on job_applications first
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can insert applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create applications" ON job_applications;
DROP POLICY IF EXISTS "Authenticated users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can view all job applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON job_applications;

-- Create policies that allow:
-- 1. Admins can view all applications
-- 2. Users can view their own applications
-- 3. Users can insert their own applications

CREATE POLICY "Admins can view all job applications"
ON job_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own job applications"
ON job_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create job applications"
ON job_applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Make product-images bucket private (if not already)
UPDATE storage.buckets SET public = false WHERE id = 'product-images';

-- Update storage policy to use signed URLs
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view product images" ON storage.objects;

CREATE POLICY "Authenticated users can view product images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'product-images');