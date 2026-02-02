import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  category: string | null;
  stock_quantity: number;
  is_active: boolean;
  seller_id?: string | null;
  created_at?: string | null;
}

interface UseProductsOptions {
  category?: string;
  sellerId?: string;
}

export const useProducts = (options?: string | UseProductsOptions) => {
  const queryClient = useQueryClient();
  
  // Support both old pattern (category string) and new pattern (options object)
  const category = typeof options === 'string' ? options : options?.category;
  const sellerId = typeof options === 'object' ? options?.sellerId : undefined;
  
  const query = useQuery({
    queryKey: ["products", category, sellerId],
    queryFn: async () => {
      let q = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (sellerId) {
        q = q.eq("seller_id", sellerId);
      } else {
        q = q.eq("is_active", true);
      }
      
      if (category) {
        q = q.eq("category", category);
      }
      
      const { data, error } = await q;
      if (error) throw error;
      return data as Product[];
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
  });

  return {
    ...query,
    products: query.data,
    deleteProduct: deleteProductMutation.mutate,
  };
};

export const useMyProducts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["my-products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!user,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
  });
};
