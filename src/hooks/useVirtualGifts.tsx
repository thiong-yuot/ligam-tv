import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  price: number;
  animation_url: string | null;
  is_active: boolean;
}

export const useVirtualGifts = () => {
  return useQuery({
    queryKey: ["virtual-gifts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("virtual_gifts")
        .select("*")
        .eq("is_active", true)
        .order("price");
      
      if (error) throw error;
      return data as VirtualGift[];
    },
  });
};

export const useSendGift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      recipientId, 
      giftId, 
      streamId, 
      amount,
      message 
    }: { 
      recipientId: string; 
      giftId: string; 
      streamId?: string;
      amount: number;
      message?: string;
    }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("gift_transactions")
        .insert({
          sender_id: session.session.user.id,
          recipient_id: recipientId,
          gift_id: giftId,
          stream_id: streamId,
          amount,
          message,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
    },
  });
};
