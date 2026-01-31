import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useApplyForJob = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("job_applications")
        .insert(data);
      
      if (error) throw error;
    },
  });
};
