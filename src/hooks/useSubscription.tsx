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
    maxProducts: 1,
    maxCourses: 1,
    maxGigs: Infinity,
    canFulfillGigs: true,
    features: [
      "Unlimited streaming",
      "Basic chat features",
      "Standard video quality",
      "Community support",
      "Full service access (20% commission)",
      "1 store product",
      "1 course",
      "Buy unlimited products & courses",
    ],
  },
  adfree: {
    name: "Ad-Free",
    price_id: "price_1SpRpU2NM66Z7c4cZTLwt0Bt",
    product_id: "prod_Tn1tFTeJxapqUs",
    price: 13,
    maxProducts: 1,
    maxCourses: 1,
    maxGigs: Infinity,
    canFulfillGigs: true,
    isViewerPlan: true,
    features: [
      "Ad-free viewing experience",
      "No ads during live broadcasts",
      "No ads on all platform content",
      "Standard video quality",
      "Community support",
      "1 store product",
      "1 course",
    ],
  },
  creator: {
    name: "Creator",
    price_id: "price_1SmNW62NM66Z7c4cnBpoYoSP",
    product_id: "prod_TjrEloM1vLq5gW",
    price: 15.99,
    maxProducts: 3,
    maxCourses: 3,
    maxGigs: Infinity,
    canFulfillGigs: true,
    features: [
      "Everything in Free",
      "HD streaming (1080p)",
      "Custom reactions",
      "Priority support",
      "Stream analytics",
      "No ads for viewers",
      "Max 3 store products",
      "Full service access (20% commission)",
      "Max 3 courses",
    ],
  },
  pro: {
    name: "Pro",
    price_id: "price_1SmNWH2NM66Z7c4cIfmspU1q",
    product_id: "prod_TjrEUKyofAQv1p",
    price: 24.99,
    maxProducts: Infinity,
    maxCourses: Infinity,
    maxGigs: Infinity,
    canFulfillGigs: true,
    features: [
      "Everything in Creator",
      "4K streaming",
      "Custom overlays",
      "API access",
      "Dedicated support",
      "Revenue boost (+10%)",
      "Featured placement",
      "Unlimited store products",
      "Full service access (20% commission)",
      "Unlimited courses",
    ],
  },
} as const;

// Platform commission rates
export const PLATFORM_FEES = {
  store: 0.08, // 8% on store sales
  services: 0.20,  // 20% on freelance commissions (no service fees)
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

      // Determine tier from product ID
      let tier: SubscriptionTier = null;
      if (data.product_id === SUBSCRIPTION_TIERS.adfree.product_id) {
        tier = "adfree";
      } else if (data.product_id === SUBSCRIPTION_TIERS.creator.product_id) {
        tier = "creator";
      } else if (data.product_id === SUBSCRIPTION_TIERS.pro.product_id) {
        tier = "pro";
      }

      setState({
        subscribed: data.subscribed,
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
