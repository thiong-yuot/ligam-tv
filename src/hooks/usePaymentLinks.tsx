import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface PaymentLink {
  id: string;
  creator_id: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  slug: string;
  paid_at: string | null;
  paid_by_email: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export const useMyPaymentLinks = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-payment-links", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("payment_links")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentLink[];
    },
    enabled: !!user,
  });
};

export const usePaymentLinkBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["payment-link", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_links")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as PaymentLink;
    },
    enabled: !!slug,
  });
};

export const useCreatePaymentLink = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { amount: number; description?: string; currency?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: result, error } = await supabase
        .from("payment_links")
        .insert({
          creator_id: user.id,
          amount: data.amount,
          description: data.description || null,
          currency: data.currency || "usd",
        })
        .select()
        .single();
      if (error) throw error;
      return result as PaymentLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-payment-links"] });
    },
  });
};

export const useDeactivatePaymentLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("payment_links")
        .update({ status: "canceled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-payment-links"] });
    },
  });
};
