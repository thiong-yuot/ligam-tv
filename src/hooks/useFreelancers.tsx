import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Freelancer {
  id: string;
  user_id?: string | null;
  name: string;
  title: string;
  bio?: string | null;
  avatar_url?: string | null;
  skills?: string[] | null;
  hourly_rate?: number | null;
  rating?: number | null;
  total_jobs?: number | null;
  is_verified?: boolean | null;
  is_available?: boolean | null;
  portfolio_url?: string | null;
  portfolio_images?: string[] | null;
  thumbnail_url?: string | null;
}

export const useFreelancers = () => {
  return useQuery({
    queryKey: ["freelancers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("is_available", true)
        .order("rating", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
