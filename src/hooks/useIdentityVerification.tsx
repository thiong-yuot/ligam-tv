import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface VerificationData {
  full_name: string;
  date_of_birth: string;
  country: string;
  id_type: string;
  address?: string;
  id_document_url?: string;
  selfie_url?: string;
}

export const useIdentityVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: verification, isLoading } = useQuery({
    queryKey: ["identity-verification", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("identity_verifications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitVerificationMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      if (!user) throw new Error("Must be logged in");

      const { data: existing } = await supabase
        .from("identity_verifications")
        .select("id, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { data: updated, error } = await supabase
          .from("identity_verifications")
          .update({
            ...data,
            status: "submitted" as const,
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return updated;
      } else {
        const { data: created, error } = await supabase
          .from("identity_verifications")
          .insert({
            user_id: user.id,
            ...data,
            status: "submitted" as const,
            submitted_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return created;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identity-verification"] });
      toast({
        title: "Verification submitted",
        description: "We'll review your documents within 1-3 business days.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const isVerified = verification?.status === "approved";
  const isPending = verification?.status === "submitted";
  const isRejected = verification?.status === "rejected";

  return {
    verification,
    isLoading,
    isVerified,
    isPending,
    isRejected,
    submitVerification: submitVerificationMutation.mutateAsync,
    isSubmitting: submitVerificationMutation.isPending,
  };
};
