
-- Add slug column to courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add slug column to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create function to generate slug from text
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- Backfill slugs for courses
UPDATE public.courses
SET slug = public.generate_slug(title) || '-' || substring(id::text, 1, 8)
WHERE slug IS NULL;

-- Backfill slugs for products  
UPDATE public.products
SET slug = public.generate_slug(name) || '-' || substring(id::text, 1, 8)
WHERE slug IS NULL;

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Auto-generate slug on insert for courses
CREATE OR REPLACE FUNCTION public.auto_generate_course_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title) || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE TRIGGER trg_course_slug
BEFORE INSERT ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_course_slug();

-- Auto-generate slug on insert for products
CREATE OR REPLACE FUNCTION public.auto_generate_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.name) || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE TRIGGER trg_product_slug
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_product_slug();
