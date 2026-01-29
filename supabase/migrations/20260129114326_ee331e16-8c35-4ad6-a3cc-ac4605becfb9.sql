-- Create missing increment_course_enrollments function
CREATE OR REPLACE FUNCTION public.increment_course_enrollments(course_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE courses
  SET 
    total_enrollments = COALESCE(total_enrollments, 0) + 1,
    updated_at = now()
  WHERE id = course_id_param;
END;
$$;

-- Grant execute permission to service role (for edge functions)
GRANT EXECUTE ON FUNCTION public.increment_course_enrollments(uuid) TO service_role;