import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Freelancer {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  avatar_url: string | null;
  skills: string[];
  hourly_rate: number | null;
  rating: number;
  total_jobs: number;
  bio: string | null;
  portfolio_url: string | null;
  is_verified: boolean;
  is_available: boolean;
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
      return data as Freelancer[];
    },
  });
};
