-- Create discovery content table for news, videos, and articles
CREATE TABLE public.discovery_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  content_type TEXT NOT NULL DEFAULT 'news', -- news, video, daily_briefing
  thumbnail_url TEXT,
  video_url TEXT,
  source_name TEXT,
  source_count INTEGER DEFAULT 1,
  duration_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discovery_content ENABLE ROW LEVEL SECURITY;

-- Everyone can view published content
CREATE POLICY "Discovery content viewable by everyone"
ON public.discovery_content
FOR SELECT
USING (is_published = true);

-- Admins can manage content
CREATE POLICY "Admins can manage discovery content"
ON public.discovery_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create chat history for Eelai
CREATE TABLE public.eelai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.eelai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations"
ON public.eelai_conversations
FOR ALL
USING (auth.uid() = user_id);

-- Create messages table for Eelai
CREATE TABLE public.eelai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.eelai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.eelai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own messages"
ON public.eelai_messages
FOR ALL
USING (EXISTS (
  SELECT 1 FROM eelai_conversations 
  WHERE eelai_conversations.id = eelai_messages.conversation_id 
  AND eelai_conversations.user_id = auth.uid()
));