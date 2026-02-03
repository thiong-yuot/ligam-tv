import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useChatMessages = (streamId?: string) => {
  const [messages, setMessages] = useState<any[]>([]);

  const { data: initialMessages = [] } = useQuery({
    queryKey: ["chat", streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("stream_id", streamId!)
        .eq("is_deleted", false)
        .order("created_at", { ascending: true })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: !!streamId,
  });

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

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
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, username, avatar_url")
            .eq("user_id", payload.new.user_id)
            .maybeSingle();

          const newMessage = {
            ...payload.new,
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
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("chat_messages")
        .insert({
          stream_id: streamId,
          user_id: session.session.user.id,
          message: message.trim(),
        });

      if (error) throw error;
    },
  });
};
