import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useAffiliate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: affiliate, isLoading: affiliateLoading } = useQuery({
    queryKey: ["affiliate", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ["referrals", affiliate?.id],
    queryFn: async () => {
      if (!affiliate) return [];
      
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!affiliate,
  });

  const { data: earnings = [] } = useQuery({
    queryKey: ["affiliate-earnings", affiliate?.id],
    queryFn: async () => {
      if (!affiliate) return [];
      
      const { data, error } = await supabase
        .from("affiliate_earnings")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!affiliate,
  });

  const joinProgramMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");

      const { data: codeData } = await supabase.rpc("generate_referral_code");
      const referralCode = codeData || `LIG${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data, error } = await supabase
        .from("affiliates")
        .insert({
          user_id: user.id,
          referral_code: referralCode,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate"] });
      toast({
        title: "Welcome to the affiliate program!",
        description: "Your affiliate link is ready. Start sharing and earning!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to join program",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    affiliate,
    isLoading: affiliateLoading,
    referrals,
    earnings,
    joinProgram: joinProgramMutation.mutateAsync,
    isJoining: joinProgramMutation.isPending,
  };
};
