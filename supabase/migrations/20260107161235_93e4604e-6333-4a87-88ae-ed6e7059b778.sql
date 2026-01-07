-- Drop the conflicting policy first
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recreate it properly
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);