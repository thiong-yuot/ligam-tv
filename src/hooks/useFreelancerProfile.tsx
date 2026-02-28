import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface FreelancerProfile {
  id: string;
  user_id: string | null;
  name: string;
  title: string;
  avatar_url: string | null;
  thumbnail_url: string | null;
  portfolio_images: string[] | null;
  skills: string[] | null;
  hourly_rate: number | null;
  rating: number | null;
  total_jobs: number | null;
  bio: string | null;
  portfolio_url: string | null;
  is_verified: boolean | null;
  is_available: boolean | null;
  created_at: string | null;
}

export interface FreelanceService {
  id: string;
  freelancer_id: string;
  title: string;
  description: string | null;
  price: number;
  delivery_days: number | null;
  category: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

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
      return data as FreelancerProfile | null;
    },
    enabled: !!user,
  });
};

export const useFreelancerById = (id: string) => {
  return useQuery({
    queryKey: ["freelancer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as FreelancerProfile;
    },
    enabled: !!id,
  });
};

export const useFreelancerServices = (freelancerId: string) => {
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
      return data as FreelanceService[];
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
      return data as FreelanceService[];
    },
    enabled: !!myProfile?.id,
  });
};

export const useCreateFreelancerProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      title: string;
      bio?: string;
      skills?: string[];
      hourly_rate?: number;
      portfolio_url?: string;
      avatar_url?: string;
    }) => {
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
    mutationFn: async (data: Partial<FreelancerProfile>) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("freelancers")
        .update(data)
        .eq("user_id", user.id);
      
      if (error) throw error;

      // Sync display_name, avatar_url, bio to main profiles table
      const profileUpdate: Record<string, any> = { updated_at: new Date().toISOString() };
      if (data.name !== undefined) profileUpdate.display_name = data.name;
      if (data.avatar_url !== undefined) profileUpdate.avatar_url = data.avatar_url;
      if (data.bio !== undefined) profileUpdate.bio = data.bio;

      if (Object.keys(profileUpdate).length > 1) {
        await supabase
          .from("profiles")
          .update(profileUpdate)
          .eq("user_id", user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-profile"] });
      queryClient.invalidateQueries({ queryKey: ["freelancers"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      freelancer_id: string;
      title: string;
      description?: string;
      price: number;
      delivery_days?: number;
      category?: string;
    }) => {
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
    mutationFn: async ({ id, ...data }: Partial<FreelanceService> & { id: string }) => {
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
    mutationFn: async (id: string) => {
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
