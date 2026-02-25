
-- Trigger: new follower notification
CREATE OR REPLACE FUNCTION public.notify_on_follow()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  follower_name text;
  follower_username text;
BEGIN
  SELECT COALESCE(display_name, username, 'Someone'), username INTO follower_name, follower_username
  FROM profiles WHERE user_id = NEW.follower_id LIMIT 1;
  
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (NEW.following_id, 'follow', follower_name || ' followed you', NULL, '/user/' || COALESCE(follower_username, ''));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_follow_notify AFTER INSERT ON followers
FOR EACH ROW EXECUTE FUNCTION notify_on_follow();

-- Trigger: new message notification
CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  sender_name text;
BEGIN
  IF NEW.is_system_message = true THEN RETURN NEW; END IF;
  
  SELECT COALESCE(display_name, username, 'Someone') INTO sender_name
  FROM profiles WHERE user_id = NEW.sender_id LIMIT 1;
  
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (NEW.recipient_id, 'message', 'New message from ' || sender_name, LEFT(NEW.content, 100), '/messages');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_message_notify AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION notify_on_message();

-- Trigger: post like notification
CREATE OR REPLACE FUNCTION public.notify_on_post_like()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  liker_name text;
  post_owner_id uuid;
BEGIN
  SELECT user_id INTO post_owner_id FROM posts WHERE id = NEW.post_id;
  IF post_owner_id IS NULL OR post_owner_id = NEW.user_id THEN RETURN NEW; END IF;
  
  SELECT COALESCE(display_name, username, 'Someone') INTO liker_name
  FROM profiles WHERE user_id = NEW.user_id LIMIT 1;
  
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (post_owner_id, 'like', liker_name || ' liked your post', NULL, NULL);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_like_notify AFTER INSERT ON post_likes
FOR EACH ROW EXECUTE FUNCTION notify_on_post_like();

-- Trigger: new shop order notification
CREATE OR REPLACE FUNCTION public.notify_on_order()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  product_name text;
  seller_id uuid;
BEGIN
  SELECT p.name, p.seller_id INTO product_name, seller_id
  FROM products p WHERE p.id = NEW.product_id LIMIT 1;
  
  IF seller_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (seller_id, 'earning', 'New order received', 'Order for ' || COALESCE(product_name, 'a product') || ' — $' || NEW.total_amount, '/seller-dashboard');
  END IF;
  
  -- Notify buyer
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (NEW.user_id, 'order', 'Order placed', 'Your order for ' || COALESCE(product_name, 'a product') || ' has been placed', '/my-orders');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_notify AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION notify_on_order();

-- Trigger: freelancer order notification
CREATE OR REPLACE FUNCTION public.notify_on_freelancer_order()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  freelancer_user_id uuid;
BEGIN
  SELECT f.user_id INTO freelancer_user_id
  FROM freelancers f WHERE f.id = NEW.freelancer_id LIMIT 1;
  
  IF freelancer_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (freelancer_user_id, 'earning', 'New freelance order', 'New order worth $' || NEW.total_amount, '/freelancer-dashboard');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_freelancer_order_notify AFTER INSERT ON freelancer_orders
FOR EACH ROW EXECUTE FUNCTION notify_on_freelancer_order();

-- Trigger: send email on notification insert via pg_net
CREATE OR REPLACE FUNCTION public.send_notification_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE
  user_email text;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;
  
  IF user_email IS NOT NULL THEN
    PERFORM net.http_post(
      url := 'https://sghavrsbomsxrwlpyrln.supabase.co/functions/v1/send-notification-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnaGF2cnNib21zeHJ3bHB5cmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MjcxNDYsImV4cCI6MjA4MjUwMzE0Nn0.bR6ZIPgJguAujLf7PFcHJbuThbPaEug-J6ik8q1kUxk"}'::jsonb,
      body := jsonb_build_object('email', user_email, 'title', NEW.title, 'message', COALESCE(NEW.message, ''), 'type', NEW.type)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_notification_send_email AFTER INSERT ON notifications
FOR EACH ROW EXECUTE FUNCTION send_notification_email();
