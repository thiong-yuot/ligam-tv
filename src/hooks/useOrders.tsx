import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  user_id: string;
  product_id: string | null;
  quantity: number;
  total_amount: number;
  status: string;
  shipping_address: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } | null;
  tracking_number: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    image_url: string | null;
    price: number;
  };
}

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(id, name, image_url, price)")
        .eq("user_id", session.session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    },
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(id, name, image_url, price)")
        .eq("id", orderId)
        .maybeSingle();
      
      if (error) throw error;
      return data as Order | null;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      product_id: string;
      quantity: number;
      total_amount: number;
      shipping_address?: Order["shipping_address"];
    }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");
      
      const { data: result, error } = await supabase
        .from("orders")
        .insert({
          user_id: session.session.user.id,
          product_id: data.product_id,
          quantity: data.quantity,
          total_amount: data.total_amount,
          shipping_address: data.shipping_address,
          status: "pending",
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, tracking_number }: { id: string; status: string; tracking_number?: string }) => {
      const updateData: Record<string, any> = { status };
      if (tracking_number) updateData.tracking_number = tracking_number;
      
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
  });
};
