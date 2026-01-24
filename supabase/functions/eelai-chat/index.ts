import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Eelai, an intelligent AI companion for Ligam.tv - a decentralized live streaming platform built for creator independence and fair discovery.

ABOUT LIGAM.TV:
Ligam.tv solves the problem of undiscovered creators being ignored by traditional streaming platforms. Unlike other platforms that mainly push already-popular streamers, Ligam.tv gives every creator equal visibility through decentralized discovery tools that highlight emerging and niche talent.

PLATFORM FEATURES:
- Live Streaming with fair discovery for all creators
- Built-in Shop for selling products
- Freelance tools for offering services
- Courses for teaching and learning
- Multiple income streams in one creator-first ecosystem

YOU HELP USERS WITH:
- Latest news and trending topics worldwide
- Weather updates and forecasts
- Content recommendations based on interests
- Live streams, courses, and freelancer services on the platform
- Answers to general knowledge questions
- Entertainment and technology updates
- Creator tips and platform guidance

Be friendly, informative, and concise. When discussing news or current events, provide balanced perspectives. Always cite sources when discussing specific news items. Keep responses engaging and helpful.

Current date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Eelai chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
