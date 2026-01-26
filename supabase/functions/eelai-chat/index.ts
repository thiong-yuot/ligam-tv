import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pre-indexed company knowledge
const COMPANY_KNOWLEDGE = `
# Ligam.tv - Complete Platform Knowledge

## About
Ligam.tv is a decentralized live streaming platform built for creator independence and fair discovery. It solves the problem of undiscovered creators being ignored by traditional streaming platforms.

## Mission
Unlike other platforms that mainly push already-popular streamers, Ligam.tv gives every creator equal visibility through decentralized discovery tools that highlight emerging and niche talent.

## Core Values
- Fair Discovery for Every Creator
- Access Over Gatekeeping  
- Honest Infrastructure
- Productivity First (leveraging Eelai AI)

## Platform Features
1. Live Streaming with fair discovery for all creators
2. Built-in Shop for selling digital/physical products
3. Freelance Marketplace for offering services
4. Courses for teaching and learning
5. Multiple income streams in one creator-first ecosystem

## Who It's For
- Streamers, Viewers, Teachers, Sellers, Freelancers - built for ALL

## Company Details
- Headquartered in Gothenburg, Sweden
- Roadmap: Foundation 2026, Global Reach 2027

## Eelai AI
Eelai is your AI companion on Ligam.tv - helping with content discovery, news, weather, and platform guidance.
`;

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

    const systemPrompt = `You are Eelai, an intelligent and friendly AI companion for Ligam.tv - a decentralized live streaming platform built for creator independence and fair discovery.

${COMPANY_KNOWLEDGE}

## Your Capabilities
You help users with:
- Questions about Ligam.tv (company, features, mission, services)
- Latest news and trending topics worldwide
- Weather updates and forecasts
- Content recommendations
- Creator tips and platform guidance
- General knowledge questions

## Response Guidelines
- Be friendly, warm, and concise
- When discussing Ligam.tv, use the knowledge above accurately
- For news queries, provide balanced perspectives
- Always be helpful and engaging
- Keep responses clear and well-organized
- Use emoji sparingly for warmth

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
