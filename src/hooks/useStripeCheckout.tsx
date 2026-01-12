import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFreelancerCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkout = async (packageId: string, requirements?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-freelancer-checkout", {
        body: { packageId, requirements },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
      toast({
        title: "Checkout failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
};

export const useCourseCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkout = async (courseId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-course-checkout", {
        body: { courseId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session";
      toast({
        title: "Checkout failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
};
