-- Create help_categories table
CREATE TABLE public.help_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'HelpCircle',
  article_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create help_articles table
CREATE TABLE public.help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category_id UUID REFERENCES public.help_categories(id) ON DELETE SET NULL,
  is_popular BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.help_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;

-- Public read access for help content
CREATE POLICY "Anyone can view active help categories"
ON public.help_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Anyone can view published help articles"
ON public.help_articles FOR SELECT
USING (is_published = true);

-- Admin write access
CREATE POLICY "Admins can manage help categories"
ON public.help_categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage help articles"
ON public.help_articles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert default categories
INSERT INTO public.help_categories (name, slug, description, icon, article_count, sort_order) VALUES
  ('Getting Started', 'getting-started', 'Learn the basics of streaming on Ligam', 'Video', 3, 1),
  ('Monetization', 'monetization', 'Earning money from your streams', 'DollarSign', 3, 2),
  ('Account & Security', 'account', 'Manage your account settings', 'Shield', 2, 3),
  ('Technical Support', 'technical', 'Troubleshooting and setup guides', 'Settings', 3, 4),
  ('Community', 'community', 'Building and managing your audience', 'Users', 2, 5),
  ('Chat & Moderation', 'moderation', 'Managing your stream chat', 'MessageSquare', 2, 6);

-- Insert default articles
INSERT INTO public.help_articles (title, content, summary, category_id, is_popular, sort_order) VALUES
  ('How to set up your first stream', 'Getting started with streaming on Ligam is easy. First, create your account and verify your email. Then navigate to your Dashboard and click "Go Live". You will receive a unique stream key that you can use with OBS or any other streaming software. Configure your encoder settings for optimal quality and you are ready to broadcast!', 'Complete guide to setting up your first live stream', (SELECT id FROM public.help_categories WHERE slug = 'getting-started'), true, 1),
  ('Connecting OBS to Ligam.tv', 'Open OBS Studio and go to Settings > Stream. Select "Custom" as the service. Enter your Ligam RTMP URL and stream key from your dashboard. Set your output resolution and bitrate based on your internet speed. Click "Start Streaming" to go live!', 'Step-by-step OBS configuration guide', (SELECT id FROM public.help_categories WHERE slug = 'getting-started'), true, 2),
  ('Understanding your analytics', 'Your Creator Dashboard provides detailed analytics including viewer count, watch time, engagement metrics, and revenue. Use these insights to optimize your streaming schedule and content strategy.', 'Learn to read and use your streaming analytics', (SELECT id FROM public.help_categories WHERE slug = 'getting-started'), true, 3),
  ('Setting up channel subscriptions', 'Enable subscriptions on your channel to let viewers support you monthly. Go to Monetization settings, set your subscription tiers and perks, then promote to your audience.', 'Guide to enabling and managing channel subscriptions', (SELECT id FROM public.help_categories WHERE slug = 'monetization'), true, 4),
  ('Enabling two-factor authentication', 'Protect your account by enabling 2FA. Go to Settings > Security, click "Enable 2FA", and follow the steps to link your authenticator app. This adds an extra layer of security to your login.', 'Secure your account with two-factor authentication', (SELECT id FROM public.help_categories WHERE slug = 'account'), true, 5),
  ('Virtual gifts and tips', 'Viewers can send you virtual gifts during streams. Each gift has a value that converts to real earnings. You can also enable direct tipping for additional support.', 'How virtual gifts and tipping work', (SELECT id FROM public.help_categories WHERE slug = 'monetization'), false, 6),
  ('Revenue and payouts', 'Track your earnings in the Monetization dashboard. Payouts are processed monthly via PayPal, bank transfer, or cryptocurrency. Minimum payout threshold is $50.', 'Understanding your revenue and payout options', (SELECT id FROM public.help_categories WHERE slug = 'monetization'), false, 7),
  ('Optimizing stream quality', 'For best results, use a wired internet connection with at least 10 Mbps upload speed. Set your encoder to x264 or NVENC, bitrate to 4500-6000 kbps for 1080p, and keyframe interval to 2 seconds.', 'Tips for optimal streaming quality', (SELECT id FROM public.help_categories WHERE slug = 'technical'), false, 8),
  ('Troubleshooting stream issues', 'Common issues include dropped frames, buffering, and audio sync problems. Check your internet stability, reduce bitrate if needed, and ensure your encoder settings match your hardware capabilities.', 'Fix common streaming problems', (SELECT id FROM public.help_categories WHERE slug = 'technical'), false, 9),
  ('Mobile streaming setup', 'Download the Ligam mobile app to stream directly from your phone. Grant camera and microphone permissions, log in, and tap "Go Live" to start broadcasting.', 'How to stream from your mobile device', (SELECT id FROM public.help_categories WHERE slug = 'technical'), false, 10),
  ('Building your audience', 'Consistency is key to growing your channel. Stream on a regular schedule, engage with your chat, collaborate with other creators, and promote your streams on social media.', 'Tips for growing your viewer base', (SELECT id FROM public.help_categories WHERE slug = 'community'), false, 11),
  ('Community guidelines', 'Maintain a positive community by setting clear rules, using moderation tools, and fostering respectful interactions. Review our full Community Guidelines for detailed policies.', 'Understanding community standards', (SELECT id FROM public.help_categories WHERE slug = 'community'), false, 12),
  ('Chat moderation tools', 'Use our built-in moderation features including slow mode, subscriber-only chat, word filters, and timeout/ban commands. Appoint trusted moderators to help manage your chat.', 'Managing your stream chat effectively', (SELECT id FROM public.help_categories WHERE slug = 'moderation'), false, 13),
  ('Setting up auto-moderation', 'Enable AutoMod to automatically filter inappropriate messages. Customize sensitivity levels and blocked terms in your Moderation settings.', 'Configure automatic chat moderation', (SELECT id FROM public.help_categories WHERE slug = 'moderation'), false, 14),
  ('Password and account recovery', 'If you forget your password, click "Forgot Password" on the login page. Enter your email to receive a reset link. For account recovery, contact support with your account details.', 'Recover access to your account', (SELECT id FROM public.help_categories WHERE slug = 'account'), false, 15);

-- Update article counts
UPDATE public.help_categories SET article_count = (
  SELECT COUNT(*) FROM public.help_articles 
  WHERE category_id = help_categories.id AND is_published = true
);