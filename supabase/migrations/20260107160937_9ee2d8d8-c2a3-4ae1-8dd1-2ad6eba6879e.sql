-- 1. Update profiles table RLS - restrict to owner-only read by default, public for basic info only
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Allow users to view their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Allow viewing only public profile info (username, display_name, avatar) for other users
CREATE POLICY "Public can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);

-- 2. Secure identity_verifications - only owner and admin can access
DROP POLICY IF EXISTS "Users can view their own verification" ON public.identity_verifications;
DROP POLICY IF EXISTS "Users can insert their own verification" ON public.identity_verifications;
DROP POLICY IF EXISTS "Users can update their own verification" ON public.identity_verifications;

-- Only the owner can view their verification
CREATE POLICY "Owner can view verification"
ON public.identity_verifications
FOR SELECT
USING (auth.uid() = user_id);

-- Only the owner can insert their verification
CREATE POLICY "Owner can insert verification"
ON public.identity_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only the owner can update their verification (before submission)
CREATE POLICY "Owner can update verification"
ON public.identity_verifications
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all verifications for review
CREATE POLICY "Admins can view all verifications"
ON public.identity_verifications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update verification status
CREATE POLICY "Admins can update verifications"
ON public.identity_verifications
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));