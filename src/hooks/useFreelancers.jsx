import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
