import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { streamSchema, validateOrThrow } from "@/lib/validation";

export interface Stream {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  is_live: boolean;
  viewer_count: number;
  peak_viewers: number;
  total_views: number;
  duration_seconds: number;
  tags: string[];
  is_featured: boolean;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  hls_url?: string | null;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    is_verified: boolean;
    follower_count: number;
  };
  categories?: {
    name: string;
    slug: string;
  };
}

export interface StreamCredentials {
  id: string;
  stream_id: string;
  stream_key: string;
  rtmp_url: string;
  created_at: string;
}

export const useStreams = (categoryId?: string, isLive?: boolean) => {
  return useQuery({
    queryKey: ["streams", categoryId, isLive],
    queryFn: async () => {
      let query = supabase
        .from("streams")
        .select("*")
        .order("viewer_count", { ascending: false });
      
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (isLive !== undefined) {
        query = query.eq("is_live", isLive);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Stream[];
    },
  });
};

export const useStream = (id: string) => {
  return useQuery({
    queryKey: ["stream", id],
    queryFn: async () => {
      // Skip demo IDs - they don't exist in database
      if (id.startsWith('demo-') || id.startsWith('sample-')) {
        return null;
      }
      
      // Fetch stream data
      const { data: stream, error: streamError } = await supabase
        .from("streams")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (streamError) throw streamError;
      if (!stream) return null;

      // Fetch profile data separately (no FK relationship)
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, is_verified, follower_count")
        .eq("user_id", stream.user_id)
        .maybeSingle();

      // Fetch category data if category_id exists
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
      } as unknown as Stream;
    },
    enabled: !!id && !id.startsWith('demo-') && !id.startsWith('sample-'),
    refetchInterval: 5000,
  });
};

export const useUserStream = (userId: string) => {
  return useQuery({
    queryKey: ["userStream", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      return data as unknown as Stream | null;
    },
    enabled: !!userId,
  });
};

// New hook to fetch stream credentials (only for stream owner)
export const useStreamCredentials = (streamId: string) => {
  return useQuery({
    queryKey: ["streamCredentials", streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stream_credentials")
        .select("*")
        .eq("stream_id", streamId)
        .maybeSingle();
      
      if (error && error.code !== "PGRST116") throw error;
      return data as StreamCredentials | null;
    },
    enabled: !!streamId,
  });
};

export const useCreateStream = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; description?: string; category_id?: string; tags?: string[] }) => {
      // Validate input
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


export const useUpdateStream = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Stream> & { id: string }) => {
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
