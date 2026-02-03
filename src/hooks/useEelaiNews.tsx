import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  content: string;
  publishedAt: string;
}

export const useEelaiNews = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNews = async (query?: string, category?: string): Promise<NewsItem[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke("eelai-news", {
        body: { query, category },
      });

      if (funcError) {
        throw funcError;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch news");
      }

      return data.data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch news";
      setError(message);
      console.error("News search error:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { searchNews, isLoading, error };
};
