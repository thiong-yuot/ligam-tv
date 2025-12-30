-- Create function to increment viewer count
CREATE OR REPLACE FUNCTION public.increment_viewer_count(stream_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_viewers integer;
  current_peak integer;
BEGIN
  SELECT viewer_count, peak_viewers INTO current_viewers, current_peak
  FROM streams WHERE id = stream_id;
  
  UPDATE streams
  SET 
    viewer_count = COALESCE(current_viewers, 0) + 1,
    peak_viewers = GREATEST(COALESCE(current_peak, 0), COALESCE(current_viewers, 0) + 1)
  WHERE id = stream_id;
END;
$$;

-- Create function to decrement viewer count
CREATE OR REPLACE FUNCTION public.decrement_viewer_count(stream_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE streams
  SET viewer_count = GREATEST(0, COALESCE(viewer_count, 1) - 1)
  WHERE id = stream_id;
END;
$$;