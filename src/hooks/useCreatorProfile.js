import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCreatorProfile = (userId) => {
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
      return data;
    },
    enabled: !!userId,
  });
};

export const useSellerProfile = (sellerId) => {
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
      return data;
    },
    enabled: !!sellerId,
  });
};
