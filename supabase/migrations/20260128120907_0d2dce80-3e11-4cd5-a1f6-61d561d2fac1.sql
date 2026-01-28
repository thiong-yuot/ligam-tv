-- Drop overly permissive public SELECT policies
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users only" ON public.profiles;

-- Create a proper policy that requires authentication
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Keep the existing "Users can view own profile" policy for clarity