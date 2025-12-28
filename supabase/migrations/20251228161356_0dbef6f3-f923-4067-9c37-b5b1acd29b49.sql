-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'creator');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  viewer_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create streams table
CREATE TABLE public.streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  stream_key TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  rtmp_url TEXT DEFAULT 'rtmp://ingest.ligam.tv/live',
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create followers table
CREATE TABLE public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (follower_id, following_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT DEFAULT 'basic',
  amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create virtual_gifts table
CREATE TABLE public.virtual_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  animation_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gift_transactions table
CREATE TABLE public.gift_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES public.streams(id) ON DELETE SET NULL,
  gift_id UUID NOT NULL REFERENCES public.virtual_gifts(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES public.streams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create earnings table
CREATE TABLE public.earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'gift', 'subscription', 'ad'
  amount DECIMAL(10,2) NOT NULL,
  source_id UUID, -- reference to gift_transaction or subscription
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'submitted', -- 'submitted', 'reviewing', 'interviewed', 'hired', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL, -- 'full-time', 'part-time', 'contract', 'remote'
  description TEXT NOT NULL,
  requirements TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table (for shop)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create faq table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pricing_plans table
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  billing_period TEXT DEFAULT 'monthly',
  features TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cms_pages table (for static pages)
CREATE TABLE public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create press_releases table
CREATE TABLE public.press_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create freelancers table
CREATE TABLE public.freelancers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  avatar_url TEXT,
  skills TEXT[],
  hourly_rate DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  total_jobs INTEGER DEFAULT 0,
  bio TEXT,
  portfolio_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create freelance_services table
CREATE TABLE public.freelance_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID NOT NULL REFERENCES public.freelancers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_days INTEGER DEFAULT 7,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelance_services ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'full_name', SPLIT_PART(NEW.email, '@', 1)), ' ', '_')) || '_' || SUBSTRING(NEW.id::text, 1, 4)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streams_updated_at
  BEFORE UPDATE ON public.streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Public read, own write
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles: Only self can view own roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Categories: Public read
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Streams: Public read, creator write
CREATE POLICY "Streams are viewable by everyone" ON public.streams FOR SELECT USING (true);
CREATE POLICY "Creators can manage own streams" ON public.streams FOR ALL USING (auth.uid() = user_id);

-- Followers: Public read, authenticated write
CREATE POLICY "Followers are viewable by everyone" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.followers FOR DELETE USING (auth.uid() = follower_id);

-- Subscriptions: Own view, authenticated create
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = creator_id);
CREATE POLICY "Users can subscribe" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);

-- Virtual gifts: Public read
CREATE POLICY "Virtual gifts are viewable by everyone" ON public.virtual_gifts FOR SELECT USING (true);

-- Gift transactions: Participants can view
CREATE POLICY "Gift participants can view" ON public.gift_transactions FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send gifts" ON public.gift_transactions FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Chat messages: Public read for stream, authenticated write
CREATE POLICY "Chat messages are viewable" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can chat" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Earnings: Own view
CREATE POLICY "Users can view own earnings" ON public.earnings FOR SELECT USING (auth.uid() = user_id);

-- Contact submissions: Anyone can submit
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contacts" ON public.contact_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Job applications: Own view, anyone submit
CREATE POLICY "Users can view own applications" ON public.job_applications FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Anyone can apply" ON public.job_applications FOR INSERT WITH CHECK (true);

-- Jobs: Public read
CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT USING (is_active = true);

-- Products: Public read
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);

-- Orders: Own view
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: Via orders
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can add order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- FAQs: Public read
CREATE POLICY "FAQs are viewable by everyone" ON public.faqs FOR SELECT USING (is_active = true);

-- Pricing plans: Public read
CREATE POLICY "Pricing plans are viewable by everyone" ON public.pricing_plans FOR SELECT USING (is_active = true);

-- CMS pages: Public read
CREATE POLICY "CMS pages are viewable by everyone" ON public.cms_pages FOR SELECT USING (is_published = true);

-- Press releases: Public read
CREATE POLICY "Press releases are viewable by everyone" ON public.press_releases FOR SELECT USING (is_published = true);

-- Freelancers: Public read
CREATE POLICY "Freelancers are viewable by everyone" ON public.freelancers FOR SELECT USING (true);
CREATE POLICY "Users can manage own freelancer profile" ON public.freelancers FOR ALL USING (auth.uid() = user_id);

-- Freelance services: Public read
CREATE POLICY "Freelance services are viewable by everyone" ON public.freelance_services FOR SELECT USING (is_active = true);

-- Enable realtime for chat and streams
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.streams;

-- Insert default categories
INSERT INTO public.categories (name, slug, description, tags, sort_order) VALUES
  ('Gaming', 'gaming', 'Watch live gaming streams', ARRAY['Action', 'RPG', 'FPS'], 1),
  ('Music', 'music', 'Live music performances and DJ sets', ARRAY['Live DJ', 'Production', 'Concerts'], 2),
  ('Creative', 'creative', 'Art, design and creative content', ARRAY['Digital Art', 'Design', 'Crafts'], 3),
  ('Talk Shows', 'talk-shows', 'Podcasts, interviews and discussions', ARRAY['Podcast', 'Interview', 'Discussion'], 4),
  ('Coding', 'coding', 'Programming and tech tutorials', ARRAY['Programming', 'Tech', 'Tutorials'], 5),
  ('Fitness', 'fitness', 'Workout and health streams', ARRAY['Workout', 'Health', 'Training'], 6),
  ('Lifestyle', 'lifestyle', 'Vlogs, travel and daily life', ARRAY['Vlog', 'Travel', 'Daily'], 7),
  ('Entertainment', 'entertainment', 'Comedy, shows and entertainment', ARRAY['Comedy', 'Shows', 'Fun'], 8),
  ('Education', 'education', 'Learning and educational content', ARRAY['Tutorials', 'Learning', 'Courses'], 9);

-- Insert default virtual gifts
INSERT INTO public.virtual_gifts (name, icon, price) VALUES
  ('Heart', '❤️', 1.00),
  ('Star', '⭐', 2.00),
  ('Diamond', '💎', 5.00),
  ('Crown', '👑', 10.00),
  ('Rocket', '🚀', 25.00),
  ('Trophy', '🏆', 50.00),
  ('Fire', '🔥', 3.00),
  ('Rainbow', '🌈', 15.00);

-- Insert default FAQs
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
  ('How do I start streaming on Ligam.tv?', 'To start streaming, create an account, go to your Dashboard, and click "Go Live". You will receive a stream key to use with OBS or other streaming software.', 'getting-started', 1),
  ('What are the system requirements?', 'For streaming: A stable internet connection (minimum 5 Mbps upload), OBS or similar software, and a decent webcam/microphone. For viewing: Any modern browser.', 'technical', 2),
  ('How do I earn money on Ligam.tv?', 'Creators can earn through virtual gifts from viewers, channel subscriptions, and ad revenue sharing. Premium creators get additional monetization options.', 'monetization', 3),
  ('Can I stream from mobile?', 'Yes! You can use our mobile app to stream directly from your phone or tablet.', 'technical', 4),
  ('How do subscriptions work?', 'Viewers can subscribe to their favorite creators for exclusive content and perks. Creators receive a portion of the subscription fee.', 'monetization', 5),
  ('What content is not allowed?', 'We prohibit illegal content, harassment, hate speech, and explicit adult content. Please review our Community Guidelines for details.', 'policies', 6),
  ('How do I report a problem?', 'You can report issues through the Help Center or by emailing support@ligam.tv. For urgent safety issues, use the in-stream report button.', 'support', 7),
  ('Can I customize my channel?', 'Yes! Premium users can fully customize their channel with custom themes, overlays, and panels.', 'features', 8);

-- Insert default pricing plans
INSERT INTO public.pricing_plans (name, price, billing_period, features, is_featured, sort_order) VALUES
  ('Free', 0.00, 'monthly', ARRAY['Basic streaming', 'Standard quality', 'Chat access', 'Basic analytics'], false, 1),
  ('Creator', 9.99, 'monthly', ARRAY['HD streaming up to 1080p', 'Custom overlays', 'Priority support', 'Advanced analytics', 'No ads on channel', 'Custom emotes'], true, 2),
  ('Pro', 24.99, 'monthly', ARRAY['4K streaming', 'All Creator features', 'Revenue sharing boost', 'Featured placement', 'Verified badge', 'API access', 'Dedicated account manager'], false, 3),
  ('Enterprise', 99.99, 'monthly', ARRAY['Unlimited everything', 'White-label options', 'Custom integrations', '24/7 support', 'SLA guarantee', 'Multi-channel management'], false, 4);

-- Insert default jobs
INSERT INTO public.jobs (title, department, location, type, description, requirements) VALUES
  ('Senior Frontend Developer', 'Engineering', 'Remote', 'full-time', 'Join our team to build the next generation streaming platform using React and TypeScript.', ARRAY['5+ years React experience', 'TypeScript proficiency', 'Experience with video streaming']),
  ('Product Designer', 'Design', 'San Francisco, CA', 'full-time', 'Design beautiful and intuitive experiences for millions of users.', ARRAY['4+ years product design', 'Figma expertise', 'Understanding of design systems']),
  ('Community Manager', 'Operations', 'Remote', 'full-time', 'Build and nurture our global community of creators and viewers.', ARRAY['2+ years community management', 'Excellent communication', 'Passion for streaming']),
  ('Data Analyst', 'Analytics', 'New York, NY', 'full-time', 'Turn data into insights that drive product decisions.', ARRAY['SQL proficiency', 'Experience with analytics tools', 'Statistical analysis skills']);

-- Insert default products
INSERT INTO public.products (name, description, price, sale_price, category, stock_quantity) VALUES
  ('Ligam Pro Webcam', 'Professional 4K webcam with built-in lighting', 149.99, 129.99, 'Equipment', 50),
  ('Streaming Microphone Kit', 'Studio-quality USB microphone with pop filter', 199.99, NULL, 'Equipment', 35),
  ('Ligam T-Shirt', 'Premium cotton t-shirt with Ligam logo', 29.99, 24.99, 'Apparel', 200),
  ('Green Screen Kit', 'Collapsible green screen with stand', 89.99, NULL, 'Equipment', 25),
  ('RGB Ring Light', 'Professional ring light with multiple color modes', 79.99, 69.99, 'Equipment', 75),
  ('Ligam Hoodie', 'Comfortable hoodie with embroidered logo', 59.99, NULL, 'Apparel', 150),
  ('Stream Deck Mini', 'Customizable control panel for streamers', 249.99, 219.99, 'Equipment', 20),
  ('Ligam Cap', 'Adjustable cap with Ligam branding', 24.99, NULL, 'Apparel', 100);

-- Insert CMS pages
INSERT INTO public.cms_pages (slug, title, content, meta_description) VALUES
  ('terms', 'Terms of Service', 'These Terms of Service govern your use of Ligam.tv...', 'Ligam.tv Terms of Service'),
  ('privacy', 'Privacy Policy', 'Your privacy is important to us...', 'Ligam.tv Privacy Policy'),
  ('guidelines', 'Community Guidelines', 'Our community guidelines ensure a safe environment...', 'Ligam.tv Community Guidelines'),
  ('cookies', 'Cookie Policy', 'We use cookies to improve your experience...', 'Ligam.tv Cookie Policy'),
  ('safety', 'Safety Center', 'Your safety is our priority...', 'Ligam.tv Safety Center');

-- Insert sample freelancers
INSERT INTO public.freelancers (name, title, skills, hourly_rate, rating, total_jobs, bio, is_verified, is_available) VALUES
  ('Alex Chen', 'Video Editor & Motion Designer', ARRAY['Video Editing', 'After Effects', 'Motion Graphics'], 75.00, 4.9, 127, 'Professional video editor with 8+ years of experience in streaming content.', true, true),
  ('Sarah Miller', 'Overlay & Graphics Designer', ARRAY['Photoshop', 'Illustrator', 'Stream Overlays'], 50.00, 4.8, 89, 'Creating stunning stream graphics and overlays for top creators.', true, true),
  ('James Wilson', 'Stream Coach & Consultant', ARRAY['Growth Strategy', 'Content Planning', 'Monetization'], 100.00, 5.0, 45, 'Helped over 100 streamers grow their audience and revenue.', true, true),
  ('Emily Davis', 'Social Media Manager', ARRAY['Social Media', 'Content Strategy', 'Community Building'], 45.00, 4.7, 63, 'Specializing in building engaged communities for streamers.', false, true);

-- Insert press releases
INSERT INTO public.press_releases (title, content, summary, published_at, is_published) VALUES
  ('Ligam.tv Reaches 10 Million Monthly Active Users', 'We are thrilled to announce that Ligam.tv has reached a significant milestone...', 'Ligam.tv celebrates 10M MAU milestone.', now() - interval '7 days', true),
  ('New Creator Fund Launches with $5M Investment', 'Today we announce the launch of our Creator Fund...', 'Ligam.tv launches $5M Creator Fund to support emerging streamers.', now() - interval '30 days', true),
  ('Partnership with Major Esports Organization', 'Ligam.tv partners with leading esports teams...', 'Strategic partnership brings top esports content to Ligam.tv.', now() - interval '60 days', true);