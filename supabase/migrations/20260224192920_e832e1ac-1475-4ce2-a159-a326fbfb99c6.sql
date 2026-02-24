
-- Add digital file path column to products
ALTER TABLE public.products ADD COLUMN digital_file_url text;

-- Create storage bucket for digital product files
INSERT INTO storage.buckets (id, name, public) VALUES ('digital-products', 'digital-products', false);

-- Sellers can upload digital files
CREATE POLICY "Sellers can upload digital files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'digital-products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Sellers can view their own digital files
CREATE POLICY "Sellers can view own digital files"
ON storage.objects FOR SELECT
USING (bucket_id = 'digital-products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Sellers can delete their own digital files
CREATE POLICY "Sellers can delete own digital files"
ON storage.objects FOR DELETE
USING (bucket_id = 'digital-products' AND auth.uid()::text = (storage.foldername(name))[1]);
