-- Fix RLS policies for stream_earnings to be more restrictive
DROP POLICY IF EXISTS "Allow insert stream earnings" ON public.stream_earnings;
DROP POLICY IF EXISTS "Allow update stream earnings" ON public.stream_earnings;

-- Only allow service role to insert/update earnings (done via edge function)
-- Streamers can still read their own earnings via the existing policy