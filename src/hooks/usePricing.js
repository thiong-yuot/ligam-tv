import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePricingPlans = () => {
  return useQuery({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      
      if (error) throw error;
      return data;
    },
  });
};
