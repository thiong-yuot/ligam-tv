import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { chatMessageSchema, validateOrThrow } from "@/lib/validation";

export interface ChatMessage {
  id: string;
  stream_id: string;
  user_id: string;
  message: string;
  is_deleted: boolean;
  created_at: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useChatMessages = (streamId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const queryClient = useQueryClient();

  // Initial fetch
  const { data: initialMessages = [] } = useQuery({
    queryKey: ["chat", streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("stream_id", streamId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true })
        .limit(100);
      
      if (error) throw error;
      return data as unknown as ChatMessage[];
    },
    enabled: !!streamId,
  });

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!streamId) return;

    const channel = supabase
      .channel(`chat:${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `stream_id=eq.${streamId}`,
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, username, avatar_url")
            .eq("user_id", payload.new.user_id)
            .maybeSingle();

          const newMessage: ChatMessage = {
            ...payload.new as ChatMessage,
            profiles: profile || undefined,
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId]);

  return messages;
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ streamId, message }: { streamId: string; message: string }) => {
      // Validate input
      const validated = validateOrThrow(chatMessageSchema, { message });

      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user?.id || '00000000-0000-0000-0000-000000000000';

      const { error } = await supabase
        .from("chat_messages")
        .insert({
          stream_id: streamId,
          user_id: userId,
          message: validated.message,
        });

      if (error) throw error;
    },
  });
};
