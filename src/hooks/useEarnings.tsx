import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORM_FEES } from "./useSubscription";

export interface Earning {
  id: string;
  user_id: string;
  type: 'gift' | 'subscription' | 'ad' | 'store' | 'gig';
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
  
  // Tips/Gifts earnings (no platform fee on tips)
  const giftEarnings = thisMonth
    .filter(e => e.type === 'gift')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Subscription earnings
  const subEarnings = thisMonth
    .filter(e => e.type === 'subscription')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Ad revenue
  const adEarnings = thisMonth
    .filter(e => e.type === 'ad')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Store sales (after 8% platform fee)
  const storeEarningsGross = thisMonth
    .filter(e => e.type === 'store')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const storeEarnings = storeEarningsGross * (1 - PLATFORM_FEES.store);
  
  // Gig commissions (after 15% platform fee)
  const gigEarningsGross = thisMonth
    .filter(e => e.type === 'gig')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const gigEarnings = gigEarningsGross * (1 - PLATFORM_FEES.gigs);
  
  // Calculate actual net earnings
  const netTotal = giftEarnings + subEarnings + adEarnings + storeEarnings + gigEarnings;
  
  return {
    totalThisMonth: netTotal,
    giftEarnings,      // Tips/donations
    subEarnings,       // Subscriptions
    adEarnings,        // Ad revenue
    storeEarnings,     // Store sales (net)
    gigEarnings,       // Gig commissions (net)
    platformFees: {
      store: PLATFORM_FEES.store * 100,
      gigs: PLATFORM_FEES.gigs * 100,
    },
  };
};
