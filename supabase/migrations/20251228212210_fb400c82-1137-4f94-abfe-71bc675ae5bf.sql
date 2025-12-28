-- Add seller_id column to products table
ALTER TABLE public.products 
ADD COLUMN seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing RLS policy
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

-- Create new RLS policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Sellers can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = seller_id);