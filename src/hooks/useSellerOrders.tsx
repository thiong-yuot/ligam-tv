import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface SellerOrder {
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
  created_at: string;
  updated_at: string;
  product?: {
    id: string;
    name: string;
    image_url: string | null;
    price: number;
    product_type: string | null;
  };
  buyer_profile?: {
    display_name: string | null;
    username: string | null;
  };
}

export const useSellerOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["seller-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get seller's product IDs first
      const { data: products } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user.id);

      if (!products || products.length === 0) return [];

      const productIds = products.map((p) => p.id);

      const { data, error } = await supabase
        .from("orders")
        .select("*, products(id, name, image_url, price, product_type)")
        .in("product_id", productIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch buyer profiles
      const userIds = [...new Set((data || []).map((o: any) => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p])
      );

      return (data || []).map((order: any) => ({
        ...order,
        product: order.products,
        buyer_profile: profileMap.get(order.user_id) || null,
      })) as SellerOrder[];
    },
    enabled: !!user,
  });
};

export const useUpdateSellerOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      tracking_number,
    }: {
      id: string;
      status?: string;
      tracking_number?: string;
    }) => {
      const updateData: Record<string, any> = {};
      if (status) updateData.status = status;
      if (tracking_number !== undefined) updateData.tracking_number = tracking_number;

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });
};
