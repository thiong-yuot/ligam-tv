import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRecommendations = async (contentType = "all", limit = 6) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke("ai-recommendations", {
        body: { 
          userId: user?.id || null,
          contentType,
          limit 
        },
      });

      if (error) throw error;

      setRecommendations(data?.recommendations || []);
      return data?.recommendations || [];
    } catch (error) {
      console.error("Recommendations error:", error);
      toast({
        title: "Error",
        description: "Failed to get recommendations",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, getRecommendations };
};

export const useAIImageGenerate = () => {
  const [generating, setGenerating] = useState(false);
  const [image, setImage] = useState(null);
  const { toast } = useToast();

  const generateImage = async (prompt, style = null, size = "1024x1024") => {
    setGenerating(true);
    setImage(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("ai-image-generate", {
        body: { prompt, style, size },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setImage(data?.image || null);
      return data;
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Image Generation Failed",
        description: error.message || "Could not generate image",
        variant: "destructive",
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  return { generating, image, generateImage };
};

export const useAITextAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  const analyzeText = async (text, action, options = {}) => {
    setAnalyzing(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("ai-text-analyze", {
        body: { text, action, options },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data?.result || null);
      return data?.result;
    } catch (error) {
      console.error("Text analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze text",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const summarize = (text, options) => analyzeText(text, "summarize", options);
  const getSentiment = (text) => analyzeText(text, "sentiment");
  const extractKeywords = (text) => analyzeText(text, "keywords");
  const moderateContent = (text) => analyzeText(text, "moderate");
  const improveText = (text) => analyzeText(text, "improve");

  return { 
    analyzing, 
    result, 
    analyzeText,
    summarize,
    getSentiment,
    extractKeywords,
    moderateContent,
    improveText
  };
};
