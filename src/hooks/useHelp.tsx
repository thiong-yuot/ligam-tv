import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useHelpCategories = () => {
  return useQuery({
    queryKey: ["help-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      
      if (error) throw error;
      return data;
    },
  });
};

export const useHelpArticles = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["help-articles", categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("help_articles")
        .select("*")
        .eq("is_published", true)
        .order("sort_order");
      
      if (categorySlug) {
        const { data: category } = await supabase
          .from("help_categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const usePopularArticles = () => {
  return useQuery({
    queryKey: ["popular-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_articles")
        .select("*")
        .eq("is_published", true)
        .eq("is_popular", true)
        .order("sort_order")
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });
};
