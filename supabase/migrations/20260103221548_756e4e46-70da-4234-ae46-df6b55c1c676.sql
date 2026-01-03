-- Add Mux-specific columns to streams table
ALTER TABLE public.streams 
ADD COLUMN IF NOT EXISTS mux_stream_id TEXT,
ADD COLUMN IF NOT EXISTS mux_playback_id TEXT,
ADD COLUMN IF NOT EXISTS hls_url TEXT;

-- Create index for faster Mux stream lookups
CREATE INDEX IF NOT EXISTS idx_streams_mux_stream_id ON public.streams(mux_stream_id);

-- Add missing columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id),
ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger for orders updated_at if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
    CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Create freelancer_packages table for service packages
CREATE TABLE IF NOT EXISTS public.freelancer_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID REFERENCES public.freelancers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  delivery_days INTEGER NOT NULL DEFAULT 7,
  revisions INTEGER NOT NULL DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on freelancer_packages
ALTER TABLE public.freelancer_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for freelancer_packages (use DO block to check existence)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view packages' AND tablename = 'freelancer_packages') THEN
    CREATE POLICY "Anyone can view packages" 
    ON public.freelancer_packages 
    FOR SELECT 
    USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Freelancers can manage their own packages' AND tablename = 'freelancer_packages') THEN
    CREATE POLICY "Freelancers can manage their own packages" 
    ON public.freelancer_packages 
    FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.freelancers f 
        WHERE f.id = freelancer_id AND f.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Create freelancer_orders table
CREATE TABLE IF NOT EXISTS public.freelancer_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  freelancer_id UUID REFERENCES public.freelancers(id),
  package_id UUID REFERENCES public.freelancer_packages(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(10,2) NOT NULL,
  requirements TEXT,
  deliverables TEXT[],
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on freelancer_orders
ALTER TABLE public.freelancer_orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for freelancer_orders
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can view their freelancer orders' AND tablename = 'freelancer_orders') THEN
    CREATE POLICY "Clients can view their freelancer orders" 
    ON public.freelancer_orders 
    FOR SELECT 
    USING (auth.uid() = client_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Freelancers can view their orders' AND tablename = 'freelancer_orders') THEN
    CREATE POLICY "Freelancers can view their orders" 
    ON public.freelancer_orders 
    FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM public.freelancers f 
        WHERE f.id = freelancer_id AND f.user_id = auth.uid()
      )
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can create freelancer orders' AND tablename = 'freelancer_orders') THEN
    CREATE POLICY "Clients can create freelancer orders" 
    ON public.freelancer_orders 
    FOR INSERT 
    WITH CHECK (auth.uid() = client_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Freelancers can update their orders' AND tablename = 'freelancer_orders') THEN
    CREATE POLICY "Freelancers can update their orders" 
    ON public.freelancer_orders 
    FOR UPDATE 
    USING (
      EXISTS (
        SELECT 1 FROM public.freelancers f 
        WHERE f.id = freelancer_id AND f.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Add triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_freelancer_packages_updated_at') THEN
    CREATE TRIGGER update_freelancer_packages_updated_at
    BEFORE UPDATE ON public.freelancer_packages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_freelancer_orders_updated_at') THEN
    CREATE TRIGGER update_freelancer_orders_updated_at
    BEFORE UPDATE ON public.freelancer_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;