
-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT,
  media_urls TEXT[] DEFAULT '{}'::TEXT[],
  media_type TEXT DEFAULT 'text', -- text, image, video, mixed
  video_url TEXT,
  stream_id UUID REFERENCES public.streams(id) ON DELETE SET NULL,
  is_stream_replay BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Published posts are viewable by everyone" ON public.posts FOR SELECT USING (is_published = true);
CREATE POLICY "Users can create own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own drafts" ON public.posts FOR SELECT USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Likes are viewable by everyone" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- Functions for like/comment counts
CREATE OR REPLACE FUNCTION public.increment_post_likes(post_id_param UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE posts SET like_count = COALESCE(like_count, 0) + 1 WHERE id = post_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_post_likes(post_id_param UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE posts SET like_count = GREATEST(0, COALESCE(like_count, 0) - 1) WHERE id = post_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_post_comments(post_id_param UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE posts SET comment_count = COALESCE(comment_count, 0) + 1 WHERE id = post_id_param;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_post_comments(post_id_param UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE posts SET comment_count = GREATEST(0, COALESCE(comment_count, 0) - 1) WHERE id = post_id_param;
END;
$$;

-- Create storage bucket for post media
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);

-- Storage policies for post media
CREATE POLICY "Anyone can view post media" ON storage.objects FOR SELECT USING (bucket_id = 'post-media');
CREATE POLICY "Authenticated users can upload post media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete own post media" ON storage.objects FOR DELETE USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Timestamp trigger
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
