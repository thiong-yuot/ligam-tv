-- ============================================
-- FIX 1: Profiles - Restrict to authenticated users
-- ============================================
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- ============================================
-- FIX 2: Streams - Move credentials to separate protected table
-- ============================================
-- Create a separate table for stream credentials
CREATE TABLE IF NOT EXISTS public.stream_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL UNIQUE REFERENCES public.streams(id) ON DELETE CASCADE,
  stream_key text NOT NULL DEFAULT (gen_random_uuid())::text,
  rtmp_url text NOT NULL DEFAULT 'rtmps://global-live.mux.com:443/app'::text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on stream_credentials
ALTER TABLE public.stream_credentials ENABLE ROW LEVEL SECURITY;

-- Only stream owner can view their credentials
CREATE POLICY "Stream owners can view own credentials"
ON public.stream_credentials
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.streams 
    WHERE streams.id = stream_credentials.stream_id 
    AND streams.user_id = auth.uid()
  )
);

-- Only stream owner can manage their credentials
CREATE POLICY "Stream owners can manage own credentials"
ON public.stream_credentials
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.streams 
    WHERE streams.id = stream_credentials.stream_id 
    AND streams.user_id = auth.uid()
  )
);

-- Migrate existing credentials to new table
INSERT INTO public.stream_credentials (stream_id, stream_key, rtmp_url)
SELECT 
  id,
  COALESCE(stream_key, (gen_random_uuid())::text),
  COALESCE(rtmp_url, 'rtmps://global-live.mux.com:443/app'::text)
FROM public.streams
WHERE id IS NOT NULL
ON CONFLICT (stream_id) DO NOTHING;

-- Remove sensitive columns from streams table
ALTER TABLE public.streams DROP COLUMN IF EXISTS stream_key;
ALTER TABLE public.streams DROP COLUMN IF EXISTS rtmp_url;

-- ============================================
-- FIX 3: Notifications - Fix open INSERT policy
-- ============================================
DROP POLICY IF EXISTS "Anyone can receive notifications" ON public.notifications;

CREATE POLICY "Authenticated users can create notifications for themselves"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);