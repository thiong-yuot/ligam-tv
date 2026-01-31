import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      return data;
    },
  });
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(id, name, image_url, price)")
        .eq("id", orderId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data) => {
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
    mutationFn: async ({ id, status, tracking_number }) => {
      const updateData = { status };
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
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
    },
  });
};

export const useSellerOrders = (sellerId) => {
  return useQuery({
    queryKey: ["seller-orders", sellerId],
    queryFn: async () => {
      if (!sellerId) return [];
      
      // Get seller's products first
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", sellerId);
      
      if (productsError) throw productsError;
      if (!products?.length) return [];
      
      const productIds = products.map(p => p.id);
      
      const { data, error } = await supabase
        .from("orders")
        .select("*, products(id, name, image_url, price)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!sellerId,
  });
};
