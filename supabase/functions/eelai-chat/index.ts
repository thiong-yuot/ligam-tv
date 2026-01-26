import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pre-indexed company knowledge
const COMPANY_KNOWLEDGE = `
# Ligam.tv - Complete Platform Knowledge

## The Problem We're Solving
Streaming Platforms Fail Creators. The streaming industry has a blind spot.

Streamers who are writers, editors, musicians, designers, builders, etc. have no productive tools and solution to sell their crafts. Platforms favor streaming over productivity (e.g., Twitch, Kick). Low-view users receive little support and are overlooked by platforms. Users struggle to have one ecosystem for all tools, leading to a lack of accessibility.

## Our Solution: Decentralized Solution for All Creators
Streamers and viewers that are writers, editors, musicians, designers, builders, etc., are forced to use secondary tools. Our platform provides one ecosystem for all creators. We give them a unified space where their work is visible.

Our platform brings productivity tools and creative workflows. We unlock the potential of millions of overlooked creators and give audiences diverse innovation the industry has been missing.

## How It Works
With Eelai AI companion, users navigate through all aspects of the platform:
- **Built-in Shop**: Sell digital and physical products directly to your audience
- **Freelance Tools**: Offer your services and skills to clients
- **Courses**: Create and sell educational content
- Creators can stream, sell, teach, and offer services in one place

## Core Values
- Fair Discovery for Every Creator - Equal visibility regardless of follower count
- Access Over Gatekeeping - Open platform for all creators
- Honest Infrastructure - Transparent systems and fair monetization
- Productivity First - Leveraging Eelai AI to help creators succeed

## Revenue
Keep 85-92% of your earnings. Weekly payouts. No hidden fees.

## Who It's For
- Streamers, Viewers, Teachers, Sellers, Freelancers - built for ALL

## Company Details
- Headquartered in Gothenburg, Sweden
- Roadmap: Foundation 2026, Global Reach 2027

## Eelai AI
Eelai is your AI companion on Ligam.tv - helping with content discovery, news, weather, platform navigation, and creator guidance.
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
