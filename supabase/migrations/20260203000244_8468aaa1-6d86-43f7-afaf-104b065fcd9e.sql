-- Add is_public column to profiles for privacy control
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Drop existing public SELECT policy if it exists
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Create new policy: Only public profiles are viewable by everyone, users always see their own
CREATE POLICY "Public profiles viewable or own profile"
ON public.profiles
FOR SELECT
USING (
  is_public = true 
  OR auth.uid() = user_id
);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.is_public IS 'When false, profile is only visible to the owner';