import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { streamSchema, validateOrThrow } from "@/lib/validation";

export const useStreams = (categorySlug, isLive) => {
  return useQuery({
    queryKey: ["streams", categorySlug, isLive],
    queryFn: async () => {
      let query = supabase
        .from("streams")
        .select("*")
        .order("viewer_count", { ascending: false });
      
      if (isLive !== undefined) {
        query = query.eq("is_live", isLive);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useStream = (id) => {
  return useQuery({
    queryKey: ["stream", id],
    queryFn: async () => {
      if (id.startsWith('demo-') || id.startsWith('sample-')) {
        return null;
      }
      
      const { data: stream, error: streamError } = await supabase
        .from("streams")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (streamError) throw streamError;
      if (!stream) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, is_verified, follower_count")
        .eq("user_id", stream.user_id)
        .maybeSingle();

      let category = null;
      if (stream.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("name, slug")
          .eq("id", stream.category_id)
          .maybeSingle();
        category = categoryData;
      }

      return {
        ...stream,
        profiles: profile,
        categories: category,
      };
    },
    enabled: !!id && !id.startsWith('demo-') && !id.startsWith('sample-'),
  });
};

export const useUserStream = (userId) => {
  return useQuery({
    queryKey: ["userStream", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useStreamCredentials = (streamId) => {
  return useQuery({
    queryKey: ["streamCredentials", streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stream_credentials")
        .select("*")
        .eq("stream_id", streamId)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!streamId,
  });
};

export const useCreateMuxStream = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const validated = validateOrThrow(streamSchema, data);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { data: result, error } = await supabase.functions.invoke("create-mux-stream", {
        body: validated,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      queryClient.invalidateQueries({ queryKey: ["userStream"] });
      queryClient.invalidateQueries({ queryKey: ["streamCredentials"] });
    },
  });
};

export const useStreamStatus = () => {
  return useQuery({
    queryKey: ["streamStatus"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return null;
      
      const { data, error } = await supabase.functions.invoke("get-stream-status", {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });
};

export const useCreateStream = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const validated = validateOrThrow(streamSchema, data);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { data: stream, error } = await supabase
        .from("streams")
        .insert({
          user_id: session.session.user.id,
          title: validated.title,
          description: validated.description,
          category_id: validated.category_id,
          tags: validated.tags || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      return stream;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      queryClient.invalidateQueries({ queryKey: ["userStream"] });
    },
  });
};

export const useUpdateStream = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase
        .from("streams")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      queryClient.invalidateQueries({ queryKey: ["userStream"] });
    },
  });
};
