import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORM_FEES } from "./useSubscription";

export interface Earning {
  id: string;
  user_id: string;
  type: 'gift' | 'subscription' | 'ad' | 'store' | 'service' | 'course' | 'live_session';
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
  
  // Tips/Gifts earnings (after 40% platform fee)
  const giftEarningsGross = thisMonth
    .filter(e => e.type === 'gift')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const giftEarnings = giftEarningsGross * (1 - PLATFORM_FEES.tips);

  // Subscription earnings (after 40% platform fee)
  const subEarningsGross = thisMonth
    .filter(e => e.type === 'subscription')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const subEarnings = subEarningsGross * (1 - PLATFORM_FEES.subscriptions);
  
  // Ad revenue
  const adEarnings = thisMonth
    .filter(e => e.type === 'ad')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Store sales (after 20% platform fee)
  const storeEarningsGross = thisMonth
    .filter(e => e.type === 'store')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const storeEarnings = storeEarningsGross * (1 - PLATFORM_FEES.store);
  
  // Service commissions (after 25% platform fee)
  const serviceEarningsGross = thisMonth
    .filter(e => e.type === 'service' || e.type === 'gig' as any)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const serviceEarnings = serviceEarningsGross * (1 - PLATFORM_FEES.services);

  // Course earnings (after 40% platform fee)
  const courseEarningsGross = thisMonth
    .filter(e => e.type === 'course')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const courseEarnings = courseEarningsGross * (1 - PLATFORM_FEES.courses);

  // Live session earnings (after 40% platform fee)
  const liveEarningsGross = thisMonth
    .filter(e => e.type === 'live_session')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const liveEarnings = liveEarningsGross * (1 - PLATFORM_FEES.liveSession);
  
  // Calculate actual net earnings
  const netTotal = giftEarnings + subEarnings + adEarnings + storeEarnings + serviceEarnings + courseEarnings + liveEarnings;
  
  return {
    totalThisMonth: netTotal,
    giftEarnings,        // Tips/donations (net 60%)
    subEarnings,         // Subscriptions (net 60%)
    adEarnings,          // Ad revenue
    storeEarnings,       // Store sales (net 80%)
    serviceEarnings,     // Service commissions (net 75%)
    courseEarnings,      // Course sales (net 60%)
    liveEarnings,        // Live session access (net 60%)
    platformFees: {
      store: PLATFORM_FEES.store * 100,
      services: PLATFORM_FEES.services * 100,
      courses: PLATFORM_FEES.courses * 100,
      liveSession: PLATFORM_FEES.liveSession * 100,
      tips: PLATFORM_FEES.tips * 100,
      subscriptions: PLATFORM_FEES.subscriptions * 100,
    },
  };
};
