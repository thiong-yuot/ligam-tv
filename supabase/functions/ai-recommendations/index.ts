import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, contentType, limit = 6 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration missing");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch content based on type
    let contentData: any[] = [];
    let userHistory: any[] = [];

    if (contentType === "streams" || contentType === "all") {
      const { data } = await supabase
        .from("streams")
        .select("id, title, description, category_id, viewer_count, tags")
        .eq("is_live", true)
        .order("viewer_count", { ascending: false })
        .limit(20);
      if (data) contentData.push(...data.map(d => ({ ...d, type: "stream" })));
    }

    if (contentType === "courses" || contentType === "all") {
      const { data } = await supabase
        .from("courses")
        .select("id, title, description, category, average_rating, total_enrollments")
        .eq("is_published", true)
        .order("total_enrollments", { ascending: false })
        .limit(20);
      if (data) contentData.push(...data.map(d => ({ ...d, type: "course" })));
    }

    if (contentType === "products" || contentType === "all") {
      const { data } = await supabase
        .from("products")
        .select("id, name, description, category, price")
        .eq("is_active", true)
        .limit(20);
      if (data) contentData.push(...data.map(d => ({ ...d, type: "product" })));
    }

    if (contentType === "freelancers" || contentType === "all") {
      const { data } = await supabase
        .from("freelancers")
        .select("id, name, title, skills, rating, total_jobs")
        .eq("is_available", true)
        .order("rating", { ascending: false })
        .limit(20);
      if (data) contentData.push(...data.map(d => ({ ...d, type: "freelancer" })));
    }

    // Fetch user history for personalization if userId provided
    if (userId) {
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id, courses(category)")
        .eq("user_id", userId)
        .limit(10);
      
      const { data: orders } = await supabase
        .from("orders")
        .select("product_id, products(category)")
        .eq("user_id", userId)
        .limit(10);

      if (enrollments) userHistory.push(...enrollments);
      if (orders) userHistory.push(...orders);
    }

    // Use AI to rank and personalize recommendations
    const prompt = `You are a content recommendation engine for Ligam.tv.

Available content:
${JSON.stringify(contentData, null, 2)}

${userId && userHistory.length > 0 ? `User history (for personalization):
${JSON.stringify(userHistory, null, 2)}` : "No user history available - recommend popular/trending content."}

Return a JSON array of the top ${limit} recommended content IDs with reasoning. Format:
[{"id": "uuid", "type": "stream|course|product|freelancer", "score": 0.95, "reason": "Brief reason"}]

Prioritize:
1. Relevance to user interests (if history available)
2. Quality (ratings, popularity)
3. Diversity of content types
4. Trending/live content for streams`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a recommendation engine. Return only valid JSON arrays." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_recommendations",
              description: "Return personalized content recommendations",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string", enum: ["stream", "course", "product", "freelancer"] },
                        score: { type: "number" },
                        reason: { type: "string" }
                      },
                      required: ["id", "type", "score", "reason"]
                    }
                  }
                },
                required: ["recommendations"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_recommendations" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    let recommendations = [];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      recommendations = parsed.recommendations || [];
    }

    // Enrich recommendations with full data
    const enrichedRecommendations = recommendations.map((rec: any) => {
      const fullData = contentData.find(c => c.id === rec.id);
      return {
        ...rec,
        data: fullData || null
      };
    }).filter((rec: any) => rec.data);

    return new Response(JSON.stringify({ recommendations: enrichedRecommendations }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Recommendations error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
