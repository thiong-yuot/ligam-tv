import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Stripe product and price IDs - Updated pricing structure with all tier limits
export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price_id: null,
    product_id: null,
    price: 0,
    maxProducts: Infinity,
    maxCourses: Infinity,
    maxGigs: Infinity,
    canFulfillGigs: true,
    canGoLive: true,
    canPaidStream: true,
    features: [
      "Unlimited streaming",
      "HD & 4K streaming",
      "Go Live access",
      "Paid live streaming",
      "Unlimited store products",
      "Unlimited courses",
      "Full service access",
      "Stream analytics",
      "All platform tools included",
    ],
  },
} as const;

// Platform commission rates
export const PLATFORM_FEES = {
  store: 0.20,      // 20% on shop/store sales
  services: 0.25,   // 25% on freelance services
  courses: 0.40,    // 40% on course sales
  liveSession: 0.40, // 40% on paid live sessions
  tips: 0.40,       // 40% on tips & gifts
  subscriptions: 0.40, // 40% on subscriptions
} as const;

// Helper to get tier limits
export const getTierLimits = (tier: SubscriptionTier) => {
  if (!tier) return SUBSCRIPTION_TIERS.free;
  return SUBSCRIPTION_TIERS[tier];
};

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS | null;

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  tier: SubscriptionTier;
  isLoading: boolean;
}

export const useSubscription = () => {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    tier: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    // Wait for auth to initialize before making any decisions
    if (authLoading) {
      return;
    }

    // If no user after auth is done loading, set default state
    if (!user) {
      setState({
        subscribed: false,
        productId: null,
        subscriptionEnd: null,
        tier: null,
        isLoading: false,
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // All users are on free tier now
      let tier: SubscriptionTier = "free";

      setState({
        subscribed: false,
        productId: data.product_id,
        subscriptionEnd: data.subscription_end,
        tier,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, authLoading]);

  const createSubscriptionCheckout = async (priceId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please sign in to subscribe");
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          mode: "subscription",
          priceId,
          successUrl: `${window.location.origin}/pricing?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please sign in to manage subscription");
      }

      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every minute, but only if user is logged in
  useEffect(() => {
    if (!user || authLoading) return;
    
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription, user, authLoading]);

  return {
    ...state,
    checkSubscription,
    createSubscriptionCheckout,
    openCustomerPortal,
  };
};
