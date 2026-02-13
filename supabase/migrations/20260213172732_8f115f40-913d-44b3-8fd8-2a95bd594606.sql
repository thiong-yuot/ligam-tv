
-- Drop FK constraints to auth.users on tables that need seed data with demo user IDs
ALTER TABLE public.freelancers DROP CONSTRAINT freelancers_user_id_fkey;
ALTER TABLE public.products DROP CONSTRAINT products_seller_id_fkey;
ALTER TABLE public.streams DROP CONSTRAINT streams_user_id_fkey;
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_creator_id_fkey;
