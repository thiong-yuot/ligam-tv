import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  freelancer_id: string | null;
  subject: string | null;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    display_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  recipient_profile?: {
    display_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
}

export const useMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ["messages", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch sender and recipient profiles
      const userIds = [...new Set(data.flatMap(m => [m.sender_id, m.recipient_id]))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return data.map(message => ({
        ...message,
        sender_profile: profileMap.get(message.sender_id),
        recipient_profile: profileMap.get(message.recipient_id),
      })) as Message[];
    },
    enabled: !!user,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return { messages, isLoading, refetch };
};

export const useUnreadCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["unread-messages", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      recipient_id,
      freelancer_id,
      subject,
      content,
    }: {
      recipient_id: string;
      freelancer_id?: string;
      subject?: string;
      content: string;
    }) => {
      if (!user) throw new Error("Must be logged in to send messages");

      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          recipient_id,
          freelancer_id,
          subject,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId)
        .eq("recipient_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
    },
  });
};

export const useConversation = (otherUserId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversation", user?.id, otherUserId],
    queryFn: async () => {
      if (!user || !otherUserId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch profiles
      const userIds = [user.id, otherUserId];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return data.map(message => ({
        ...message,
        sender_profile: profileMap.get(message.sender_id),
        recipient_profile: profileMap.get(message.recipient_id),
      })) as Message[];
    },
    enabled: !!user && !!otherUserId,
  });
};
