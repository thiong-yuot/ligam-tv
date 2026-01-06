import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type WithdrawalStatus = "pending" | "processing" | "completed" | "rejected";

interface WithdrawalMethod {
  id: string;
  user_id: string;
  method_type: string;
  is_default: boolean;
  details: {
    bank_name?: string;
    account_number?: string;
    routing_number?: string;
    account_holder?: string;
    paypal_email?: string;
    wallet_address?: string;
    wallet_type?: string;
  };
  nickname: string | null;
  is_verified: boolean;
  created_at: string;
}

interface Withdrawal {
  id: string;
  user_id: string;
  withdrawal_method_id: string | null;
  amount: number;
  fee: number;
  net_amount: number;
  status: WithdrawalStatus;
  transaction_id: string | null;
  notes: string | null;
  processed_at: string | null;
  created_at: string;
}

interface AddWithdrawalMethodData {
  method_type: "bank_account" | "paypal" | "crypto_wallet";
  details: Record<string, string>;
  nickname?: string;
  is_default?: boolean;
}

interface RequestWithdrawalData {
  amount: number;
  withdrawal_method_id: string;
}

export const useWithdrawals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch withdrawal methods
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
      return data as WithdrawalMethod[];
    },
    enabled: !!user,
  });

  // Fetch withdrawal history
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
      return data as Withdrawal[];
    },
    enabled: !!user,
  });

  // Add withdrawal method
  const addMethodMutation = useMutation({
    mutationFn: async (data: AddWithdrawalMethodData) => {
      if (!user) throw new Error("Must be logged in");

      // If setting as default, unset other defaults
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
    onError: (error: any) => {
      toast({
        title: "Failed to add method",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Request withdrawal
  const requestWithdrawalMutation = useMutation({
    mutationFn: async (data: RequestWithdrawalData) => {
      if (!user) throw new Error("Must be logged in");

      // Calculate fee (e.g., 2% fee, min $1)
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
          status: "pending" as WithdrawalStatus,
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
    onError: (error: any) => {
      toast({
        title: "Withdrawal failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete withdrawal method
  const deleteMethodMutation = useMutation({
    mutationFn: async (methodId: string) => {
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
