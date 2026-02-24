-- Add education fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS degree text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS field_of_study text;