
-- Freelance: Add completion tracking for escrow
ALTER TABLE public.freelancer_orders 
  ADD COLUMN IF NOT EXISTS client_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS freelancer_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_released boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_released_at timestamp with time zone;

-- Shop: Add delivery confirmation and payment hold
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_confirmed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS payment_held_until timestamp with time zone,
  ADD COLUMN IF NOT EXISTS payment_released boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_released_at timestamp with time zone;

-- Notification trigger: when both freelance parties complete
CREATE OR REPLACE FUNCTION public.check_freelance_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- When both parties mark complete and payment not yet released
  IF NEW.client_completed = true AND NEW.freelancer_completed = true AND NEW.payment_released = false THEN
    -- Notify admin/platform to release payment
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT ur.user_id, 'earning', 'Freelance project completed',
      'Both parties confirmed completion for order $' || NEW.total_amount || '. Payment ready to release.',
      '/admin'
    FROM user_roles ur WHERE ur.role = 'admin';
    
    -- Release the payment: update earnings from held to available
    UPDATE earnings 
    SET status = 'available'
    WHERE source_id = NEW.package_id::text AND type = 'service' AND status = 'held';
    
    -- Mark payment as released
    NEW.payment_released := true;
    NEW.payment_released_at := now();
    NEW.status := 'completed';
    NEW.completed_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_freelance_completion_check
  BEFORE UPDATE ON public.freelancer_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.check_freelance_completion();

-- Shop delivery confirmation trigger
CREATE OR REPLACE FUNCTION public.check_shop_delivery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- When delivery is confirmed and payment not yet released
  IF NEW.delivery_confirmed_at IS NOT NULL AND OLD.delivery_confirmed_at IS NULL AND NEW.payment_released = false THEN
    -- Notify admin
    INSERT INTO notifications (user_id, type, title, message, link)
    SELECT ur.user_id, 'earning', 'Product delivered & confirmed',
      'Order $' || NEW.total_amount || ' delivery confirmed via QR scan. Payment released to seller.',
      '/admin'
    FROM user_roles ur WHERE ur.role = 'admin';
    
    -- Release seller earnings
    UPDATE earnings 
    SET status = 'available'
    WHERE source_id = NEW.id::text AND type = 'store' AND status = 'held';
    
    NEW.payment_released := true;
    NEW.payment_released_at := now();
    NEW.status := 'delivered';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_shop_delivery_check
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.check_shop_delivery();
