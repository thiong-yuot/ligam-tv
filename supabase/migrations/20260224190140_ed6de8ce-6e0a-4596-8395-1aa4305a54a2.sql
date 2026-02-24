-- Add product_type and additional_images columns to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'digital',
  ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}'::text[];