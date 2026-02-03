import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  is_active: boolean;
}

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
      return data as Job[];
    },
  });
};

export const useApplyForJob = () => {
  return useMutation({
    mutationFn: async (data: {
      position: string;
      full_name: string;
      email: string;
      phone?: string;
      cover_letter?: string;
    }) => {
      const { error } = await supabase
        .from("job_applications")
        .insert(data);
      
      if (error) throw error;
    },
  });
};
