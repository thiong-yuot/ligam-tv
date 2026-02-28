
-- Create payment_links table
CREATE TABLE public.payment_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  description text,
  status text NOT NULL DEFAULT 'active',
  slug text NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 8),
  paid_at timestamp with time zone,
  paid_by_email text,
  stripe_payment_intent_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payment_links_amount_positive CHECK (amount > 0)
);

-- Unique slug for shareable URLs
CREATE UNIQUE INDEX idx_payment_links_slug ON public.payment_links(slug);

-- Enable RLS
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- Creators can manage their own payment links
CREATE POLICY "Creators can manage own payment links"
  ON public.payment_links FOR ALL
  USING (auth.uid() = creator_id);

-- Anyone can view active payment links (for the public payment page)
CREATE POLICY "Anyone can view active payment links"
  ON public.payment_links FOR SELECT
  USING (status = 'active');

-- Trigger for updated_at
CREATE TRIGGER update_payment_links_updated_at
  BEFORE UPDATE ON public.payment_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
