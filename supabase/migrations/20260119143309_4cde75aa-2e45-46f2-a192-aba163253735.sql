-- Add paid streaming fields to streams table
ALTER TABLE public.streams 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS access_price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS preview_video_url TEXT,
ADD COLUMN IF NOT EXISTS stream_type TEXT DEFAULT 'free' CHECK (stream_type IN ('free', 'paid'));

-- Create stream access table to track who paid for access
CREATE TABLE IF NOT EXISTS public.stream_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  streamer_earnings DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(stream_id, user_id)
);

-- Enable RLS on stream_access
ALTER TABLE public.stream_access ENABLE ROW LEVEL SECURITY;

-- Users can view their own access records
CREATE POLICY "Users can view their own stream access" 
ON public.stream_access 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own access records (after payment)
CREATE POLICY "Users can insert their own stream access" 
ON public.stream_access 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Streamers can view access to their streams
CREATE POLICY "Streamers can view access to their streams" 
ON public.stream_access 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.streams 
    WHERE streams.id = stream_access.stream_id 
    AND streams.user_id = auth.uid()
  )
);

-- Create table for stream earnings tracking
CREATE TABLE IF NOT EXISTS public.stream_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  streamer_id UUID NOT NULL,
  total_earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  platform_fees DECIMAL(10,2) NOT NULL DEFAULT 0,
  access_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(stream_id)
);

-- Enable RLS on stream_earnings
ALTER TABLE public.stream_earnings ENABLE ROW LEVEL SECURITY;

-- Streamers can view their own earnings
CREATE POLICY "Streamers can view their own stream earnings" 
ON public.stream_earnings 
FOR SELECT 
USING (auth.uid() = streamer_id);

-- System can insert/update earnings
CREATE POLICY "Allow insert stream earnings" 
ON public.stream_earnings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update stream earnings" 
ON public.stream_earnings 
FOR UPDATE 
USING (true);

-- Create trigger to update stream_earnings updated_at
CREATE TRIGGER update_stream_earnings_updated_at
BEFORE UPDATE ON public.stream_earnings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for stream_access
ALTER PUBLICATION supabase_realtime ADD TABLE public.stream_access;