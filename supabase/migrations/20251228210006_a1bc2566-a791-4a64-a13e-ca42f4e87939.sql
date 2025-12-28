-- Create messages table for freelancer-client communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  freelancer_id UUID REFERENCES public.freelancers(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Users can mark their received messages as read
CREATE POLICY "Users can update own received messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = recipient_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;