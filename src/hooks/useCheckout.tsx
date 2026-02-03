import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

interface CheckoutItem {
  id: string;
  quantity: number;
  price: number;
}

export const useCheckout = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (items: CheckoutItem[], mode = "payment") => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("create-checkout", {
        body: { items, mode },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      }

      return response.data;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "Unable to create checkout session. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const createSubscriptionCheckout = async (priceId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to subscribe",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("create-checkout", {
        body: { priceId, mode: "subscription" },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      }

      return response.data;
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "Unable to start subscription. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to manage billing",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("customer-portal", {
        body: { returnUrl: window.location.href },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      toast({
        title: "Unable to open billing portal",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return {
    createCheckoutSession,
    createSubscriptionCheckout,
    openCustomerPortal,
  };
};
