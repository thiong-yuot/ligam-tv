import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Stream {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  thumbnail_url: string | null;
  stream_key: string;
  rtmp_url: string;
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

export const useStreams = (categorySlug?: string, isLive?: boolean) => {
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
      return data as unknown as Stream[];
    },
  });
};

export const useStream = (id: string) => {
  return useQuery({
    queryKey: ["stream", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      return data as unknown as Stream | null;
    },
    enabled: !!id,
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
      return data as Stream | null;
    },
    enabled: !!userId,
  });
};

export const useCreateStream = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; description?: string; category_id?: string; tags?: string[] }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { data: stream, error } = await supabase
        .from("streams")
        .insert({
          user_id: session.session.user.id,
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          tags: data.tags || [],
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
