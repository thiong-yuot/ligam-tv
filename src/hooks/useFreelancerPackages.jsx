import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFreelancerPackages = (freelancerId) => {
  return useQuery({
    queryKey: ["freelancer-packages", freelancerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancer_packages")
        .select("*")
        .eq("freelancer_id", freelancerId)
        .order("price", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!freelancerId,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from("freelancer_packages")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-packages", variables.freelancer_id] });
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase
        .from("freelancer_packages")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-packages"] });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("freelancer_packages")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-packages"] });
    },
  });
};

export const useMyFreelancerOrders = () => {
  return useQuery({
    queryKey: ["my-freelancer-orders"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      
      const { data, error } = await supabase
        .from("freelancer_orders")
        .select("*, freelancer_packages(*)")
        .eq("client_id", session.session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFreelancerIncomingOrders = (freelancerId) => {
  return useQuery({
    queryKey: ["freelancer-incoming-orders", freelancerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancer_orders")
        .select("*, freelancer_packages(*)")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!freelancerId,
  });
};

export const useCreateFreelancerOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { data: result, error } = await supabase
        .from("freelancer_orders")
        .insert({
          client_id: session.session.user.id,
          freelancer_id: data.freelancer_id,
          package_id: data.package_id,
          total_amount: data.total_amount,
          requirements: data.requirements,
          status: "pending",
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer-incoming-orders"] });
    },
  });
};

export const useUpdateFreelancerOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const { error } = await supabase
        .from("freelancer_orders")
        .update(data)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-freelancer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["freelancer-incoming-orders"] });
    },
  });
};
