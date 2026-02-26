import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFreelancerCheckout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkout = async (packageId: string, requirements?: string) => {
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Please login to place an order");

      const { data, error } = await supabase.functions.invoke("create-freelancer-checkout", {
        body: { packageId, requirements },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to create checkout session",
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
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Please login to enroll");

      const { data, error } = await supabase.functions.invoke("create-course-checkout", {
        body: { courseId },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
};
