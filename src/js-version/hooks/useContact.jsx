import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase
        .from("contact_submissions")
        .insert(data);
      
      if (error) throw error;
    },
  });
};
