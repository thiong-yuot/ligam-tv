import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PressRelease {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
}

export const usePressReleases = () => {
  return useQuery({
    queryKey: ["press-releases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("press_releases")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data as PressRelease[];
    },
  });
};
