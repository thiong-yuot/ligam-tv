import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

export const useFAQs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      
      if (error) throw error;
      return data as FAQ[];
    },
  });
};
