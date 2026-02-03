import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsFollowing = (userId) => {
  return useQuery({
    queryKey: ["isFollowing", userId],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return false;
      
      const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", session.session.user.id)
        .eq("following_id", userId)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!userId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("followers")
        .insert({
          follower_id: session.session.user.id,
          following_id: userId,
        });
      
      if (error) throw error;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", userId] });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", session.session.user.id)
        .eq("following_id", userId);
      
      if (error) throw error;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", userId] });
    },
  });
};
