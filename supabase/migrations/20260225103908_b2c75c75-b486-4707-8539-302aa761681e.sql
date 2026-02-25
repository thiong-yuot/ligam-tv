-- Drop the trigger that calls pg_net (which doesn't exist) so inserts work again
DROP TRIGGER IF EXISTS on_notification_send_email ON public.notifications;
DROP FUNCTION IF EXISTS public.send_notification_email();