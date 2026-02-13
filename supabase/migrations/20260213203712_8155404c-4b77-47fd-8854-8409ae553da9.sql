-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Authenticated users can chat" ON public.chat_messages;

-- Create a new policy that allows anyone (including guests) to insert chat messages
CREATE POLICY "Anyone can chat" ON public.chat_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);