import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDiscoveryContent = () => {
  return useQuery({
    queryKey: ["discovery-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discovery_content")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useFeaturedContent = () => {
  return useQuery({
    queryKey: ["featured-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discovery_content")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(2);

      if (error) throw error;
      return data;
    },
  });
};
