import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useMyFreelancerProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-freelancer-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useFreelancerById = (id) => {
  return useQuery({
    queryKey: ["freelancer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useFreelancerServices = (freelancerId) => {
  return useQuery({
    queryKey: ["freelancer-services", freelancerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelance_services")
        .select("*")
        .eq("freelancer_id", freelancerId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!freelancerId,
  });
};

export const useMyFreelancerServices = () => {
  const { data: myProfile } = useMyFreelancerProfile();

  return useQuery({
    queryKey: ["my-freelancer-services", myProfile?.id],
    queryFn: async () => {
      if (!myProfile) return [];
      
      const { data, error } = await supabase
        .from("freelance_services")
        .select("*")
        .eq("freelancer_id", myProfile.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!myProfile?.id,
  });
};

export const useCreateFreelancerProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("Not authenticated");

      const { data: result, error } = await supabase
        .from("freelancers")
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-profile"] });
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
    },
  });
};

export const useUpdateFreelancerProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("freelancers")
        .update(data)
        .eq("user_id", user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-profile"] });
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from("freelance_services")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-services", variables.freelancer_id] });
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase
        .from("freelance_services")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-services"] });
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("freelance_services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-services"] });
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-services"] });
    },
  });
};
