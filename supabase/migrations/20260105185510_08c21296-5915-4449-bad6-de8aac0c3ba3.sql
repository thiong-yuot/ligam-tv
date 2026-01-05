-- Add portfolio images array to freelancers
ALTER TABLE public.freelancers 
ADD COLUMN IF NOT EXISTS portfolio_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Create storage bucket for freelancer portfolios
INSERT INTO storage.buckets (id, name, public) 
VALUES ('freelancer-portfolios', 'freelancer-portfolios', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for course content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-content', 'course-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for freelancer portfolios
CREATE POLICY "Anyone can view freelancer portfolios"
ON storage.objects FOR SELECT
USING (bucket_id = 'freelancer-portfolios');

CREATE POLICY "Authenticated users can upload freelancer portfolios"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'freelancer-portfolios' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own freelancer portfolios"
ON storage.objects FOR UPDATE
USING (bucket_id = 'freelancer-portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own freelancer portfolios"
ON storage.objects FOR DELETE
USING (bucket_id = 'freelancer-portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for course content
CREATE POLICY "Anyone can view course content"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-content');

CREATE POLICY "Authenticated users can upload course content"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'course-content' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own course content"
ON storage.objects FOR UPDATE
USING (bucket_id = 'course-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own course content"
ON storage.objects FOR DELETE
USING (bucket_id = 'course-content' AND auth.uid()::text = (storage.foldername(name))[1]);