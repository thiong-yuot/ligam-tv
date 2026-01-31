import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useAnalytics = (type = "overview") => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ["analytics", type],
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      const { data, error } = await supabase.functions.invoke("analytics-dashboard", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: null,
        method: "GET",
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

export const useCreatorAnalytics = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ["analytics", "creator"],
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-dashboard?type=creator`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!session,
    staleTime: 60000,
  });
};

export const useSellerAnalytics = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ["analytics", "seller"],
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-dashboard?type=seller`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!session,
    staleTime: 60000,
  });
};

export const useFreelancerAnalytics = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ["analytics", "freelancer"],
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-dashboard?type=freelancer`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!session,
    staleTime: 60000,
  });
};

export const useAllAnalytics = () => {
  const { session } = useAuth();
  
  return useQuery({
    queryKey: ["analytics", "all"],
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-dashboard?type=all`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!session,
    staleTime: 60000,
  });
};
