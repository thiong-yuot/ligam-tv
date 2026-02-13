
-- Drop the FK constraint on profiles to allow demo/seed users
ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_id_fkey;
