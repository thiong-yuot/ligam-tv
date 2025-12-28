import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Earning {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  source_id: string | null;
  status: string;
  created_at: string;
}

export const useEarnings = () => {
  return useQuery({
    queryKey: ["earnings"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      
      const { data, error } = await supabase
        .from("earnings")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Earning[];
    },
  });
};

export const useEarningsSummary = () => {
  const { data: earnings = [] } = useEarnings();
  
  const now = new Date();
  const thisMonth = earnings.filter(e => {
    const date = new Date(e.created_at);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  
  const totalThisMonth = thisMonth.reduce((sum, e) => sum + Number(e.amount), 0);
  const giftEarnings = thisMonth.filter(e => e.type === 'gift').reduce((sum, e) => sum + Number(e.amount), 0);
  const subEarnings = thisMonth.filter(e => e.type === 'subscription').reduce((sum, e) => sum + Number(e.amount), 0);
  const adEarnings = thisMonth.filter(e => e.type === 'ad').reduce((sum, e) => sum + Number(e.amount), 0);
  
  return {
    totalThisMonth,
    giftEarnings,
    subEarnings,
    adEarnings,
  };
};
