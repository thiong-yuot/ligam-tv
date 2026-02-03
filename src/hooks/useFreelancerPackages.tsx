import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FreelancerPackage {
  id: string;
  freelancer_id: string;
  name: string;
  description: string | null;
  price: number;
  delivery_days: number;
  revisions: number;
  features: string[];
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface FreelancerOrder {
  id: string;
  client_id: string;
  freelancer_id: string;
  package_id: string | null;
  status: string;
  total_amount: number;
  requirements: string | null;
  deliverables: string[] | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  package?: FreelancerPackage;
}

export const useFreelancerPackages = (freelancerId: string) => {
  return useQuery({
    queryKey: ["freelancer-packages", freelancerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancer_packages")
        .select("*")
        .eq("freelancer_id", freelancerId)
        .order("price", { ascending: true });
      
      if (error) throw error;
      return data as FreelancerPackage[];
    },
    enabled: !!freelancerId,
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<FreelancerPackage, "id" | "created_at" | "updated_at">) => {
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
    mutationFn: async ({ id, ...data }: Partial<FreelancerPackage> & { id: string }) => {
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
    mutationFn: async (id: string) => {
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
      return data as FreelancerOrder[];
    },
  });
};

export const useFreelancerIncomingOrders = (freelancerId: string) => {
  return useQuery({
    queryKey: ["freelancer-incoming-orders", freelancerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancer_orders")
        .select("*, freelancer_packages(*)")
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as FreelancerOrder[];
    },
    enabled: !!freelancerId,
  });
};

export const useCreateFreelancerOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      freelancer_id: string;
      package_id: string;
      total_amount: number;
      requirements?: string;
    }) => {
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
    mutationFn: async ({ id, ...data }: { id: string; status?: string; deliverables?: string[]; completed_at?: string }) => {
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
