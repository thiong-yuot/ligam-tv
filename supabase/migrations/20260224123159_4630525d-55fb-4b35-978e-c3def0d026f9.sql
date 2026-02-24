
-- Remove Mux columns from streams table
ALTER TABLE public.streams DROP COLUMN IF EXISTS mux_stream_id;
ALTER TABLE public.streams DROP COLUMN IF EXISTS mux_playback_id;

-- Update stream_credentials default RTMP URL from Mux to SRS
ALTER TABLE public.stream_credentials ALTER COLUMN rtmp_url SET DEFAULT 'rtmp://your-srs-server:1935/live';

-- Update any existing credentials that still have the old Mux URL
UPDATE public.stream_credentials SET rtmp_url = 'rtmp://your-srs-server:1935/live' WHERE rtmp_url LIKE '%mux.com%';
