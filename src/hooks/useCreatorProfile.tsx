import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CreatorProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_verified: boolean;
  follower_count: number;
  total_views: number;
}

export const useCreatorProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["creator-profile", userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data as CreatorProfile | null;
    },
    enabled: !!userId,
  });
};

export const useSellerProfile = (sellerId: string | undefined) => {
  return useQuery({
    queryKey: ["seller-profile", sellerId],
    queryFn: async () => {
      if (!sellerId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", sellerId)
        .maybeSingle();

      if (error) throw error;
      return data as CreatorProfile | null;
    },
    enabled: !!sellerId,
  });
};
