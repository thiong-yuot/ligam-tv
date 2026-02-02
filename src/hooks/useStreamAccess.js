import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCheckStreamAccess = (streamId) => {
  return useQuery({
    queryKey: ["streamAccess", streamId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke("check-stream-access", {
        body: { streamId },
        headers: session?.session?.access_token 
          ? { Authorization: `Bearer ${session.session.access_token}` }
          : undefined,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!streamId,
  });
};

export const useCreateStreamCheckout = () => {
  return useMutation({
    mutationFn: async (streamId) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("create-stream-checkout", {
        body: { streamId },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
  });
};

export const useVerifyStreamAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, streamId }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("verify-stream-access", {
        body: { sessionId, streamId },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["streamAccess", variables.streamId] });
    },
  });
};

export const useStreamEarnings = (streamId) => {
  return useQuery({
    queryKey: ["streamEarnings", streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stream_earnings")
        .select("*")
        .eq("stream_id", streamId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!streamId,
  });
};

export const useUserStreamAccess = () => {
  return useQuery({
    queryKey: ["userStreamAccess"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data, error } = await supabase
        .from("stream_access")
        .select("*, streams(*)")
        .eq("user_id", session.session.user.id);

      if (error) throw error;
      return data;
    },
  });
};
