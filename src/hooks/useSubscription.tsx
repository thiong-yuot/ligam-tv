import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// Stripe product and price IDs
export const SUBSCRIPTION_TIERS = {
  creator: {
    name: "Creator",
    price_id: "price_1SjOC22NM66Z7c4cJe49qZCZ",
    product_id: "prod_Tgljtg9UNMpI1v",
    price: 5.99,
  },
  pro: {
    name: "Pro",
    price_id: "price_1SjOCX2NM66Z7c4cy98jF1Rc",
    product_id: "prod_TglkgouLdYOpMr",
    price: 15.99,
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS | null;

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  tier: SubscriptionTier;
  isLoading: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    tier: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
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
      if (!session) {
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
      if (data.product_id === SUBSCRIPTION_TIERS.creator.product_id) {
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
  }, [user]);

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

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  return {
    ...state,
    checkSubscription,
    createSubscriptionCheckout,
    openCustomerPortal,
  };
};
