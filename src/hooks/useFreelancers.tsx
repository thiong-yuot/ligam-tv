import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Freelancer {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  avatar_url: string | null;
  thumbnail_url: string | null;
  portfolio_images: string[] | null;
  skills: string[];
  hourly_rate: number | null;
  rating: number;
  total_jobs: number;
  bio: string | null;
  portfolio_url: string | null;
  is_verified: boolean;
  is_available: boolean;
  profile_username?: string | null;
}

export const useFreelancers = () => {
  return useQuery({
    queryKey: ["freelancers"],
    queryFn: async () => {
      const { data: freelancers, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("is_available", true)
        .order("rating", { ascending: false });
      
      if (error) throw error;

      // Fetch usernames for freelancers with user_id
      const userIds = (freelancers || []).filter(f => f.user_id).map(f => f.user_id!);
      let profileMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, username")
          .in("user_id", userIds);
        if (profiles) {
          profiles.forEach(p => {
            if (p.username) profileMap[p.user_id] = p.username;
          });
        }
      }

      return (freelancers || []).map(f => ({
        ...f,
        profile_username: f.user_id ? profileMap[f.user_id] || null : null,
      })) as Freelancer[];
    },
  });
};
