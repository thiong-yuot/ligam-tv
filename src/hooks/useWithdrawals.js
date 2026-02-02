import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useWithdrawals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: withdrawalMethods = [], isLoading: methodsLoading } = useQuery({
    queryKey: ["withdrawal-methods", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("withdrawal_methods")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addMethodMutation = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("Must be logged in");

      if (data.is_default) {
        await supabase
          .from("withdrawal_methods")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      const { data: created, error } = await supabase
        .from("withdrawal_methods")
        .insert({
          user_id: user.id,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-methods"] });
      toast({
        title: "Payment method added",
        description: "Your withdrawal method has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add method",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const requestWithdrawalMutation = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("Must be logged in");

      const fee = Math.max(data.amount * 0.02, 1);
      const netAmount = data.amount - fee;

      const { data: withdrawal, error } = await supabase
        .from("withdrawals")
        .insert({
          user_id: user.id,
          withdrawal_method_id: data.withdrawal_method_id,
          amount: data.amount,
          fee,
          net_amount: netAmount,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return withdrawal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request is being processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Withdrawal failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMethodMutation = useMutation({
    mutationFn: async (methodId) => {
      const { error } = await supabase
        .from("withdrawal_methods")
        .delete()
        .eq("id", methodId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawal-methods"] });
      toast({
        title: "Method removed",
        description: "Your withdrawal method has been deleted.",
      });
    },
  });

  const defaultMethod = withdrawalMethods.find(m => m.is_default) || withdrawalMethods[0];

  return {
    withdrawalMethods,
    withdrawals,
    defaultMethod,
    isLoading: methodsLoading || withdrawalsLoading,
    addMethod: addMethodMutation.mutateAsync,
    isAddingMethod: addMethodMutation.isPending,
    requestWithdrawal: requestWithdrawalMutation.mutateAsync,
    isRequesting: requestWithdrawalMutation.isPending,
    deleteMethod: deleteMethodMutation.mutateAsync,
  };
};
