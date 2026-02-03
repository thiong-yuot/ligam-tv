import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFreelancerReviews = (freelancerId) => {
  return useQuery({
    queryKey: ["freelancer-reviews", freelancerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancer_reviews")
        .select("*")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!freelancerId,
  });
};

export const useCreateFreelancerReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { data: result, error } = await supabase
        .from("freelancer_reviews")
        .insert({
          freelancer_id: data.freelancer_id,
          reviewer_id: session.session.user.id,
          order_id: data.order_id,
          rating: data.rating,
          review_text: data.review_text,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-reviews", variables.freelancer_id] });
    },
  });
};

export const useUpdateFreelancerReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase
        .from("freelancer_reviews")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-reviews"] });
    },
  });
};

export const useDeleteFreelancerReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("freelancer_reviews")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-reviews"] });
    },
  });
};
