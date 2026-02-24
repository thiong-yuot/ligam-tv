-- Fix chat_messages: restrict UPDATE/DELETE to message owners only
DROP POLICY IF EXISTS "Anyone can chat" ON public.chat_messages;

-- Allow anyone to view chat messages (public stream chat)
CREATE POLICY "Anyone can view chat messages"
ON public.chat_messages
FOR SELECT
USING (true);

-- Allow authenticated users to insert chat messages
CREATE POLICY "Authenticated users can send chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own messages
CREATE POLICY "Users can delete own chat messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);

-- Fix rate_limits: restrict to service role only (drop overly permissive policy)
DROP POLICY IF EXISTS "Service role manages rate limits" ON public.rate_limits;

CREATE POLICY "Service role manages rate limits"
ON public.rate_limits
FOR ALL
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));