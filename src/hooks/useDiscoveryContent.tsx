import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DiscoveryContent {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  content_type: string;
  thumbnail_url: string | null;
  video_url: string | null;
  source_name: string | null;
  source_count: number | null;
  duration_minutes: number | null;
  view_count: number | null;
  is_featured: boolean | null;
  published_at: string | null;
}

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
      return data as DiscoveryContent[];
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
      return data as DiscoveryContent[];
    },
  });
};
