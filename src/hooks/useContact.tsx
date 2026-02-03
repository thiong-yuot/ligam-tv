import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (data: ContactData) => {
      const { error } = await supabase
        .from("contact_submissions")
        .insert(data);
      
      if (error) throw error;
    },
  });
};
