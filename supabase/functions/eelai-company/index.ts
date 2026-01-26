import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pre-indexed company knowledge about Ligam.tv
const COMPANY_KNOWLEDGE = `
# About Ligam.tv

Ligam.tv is a decentralized live streaming platform built for creator independence and fair discovery.

## Mission
Ligam.tv solves the problem of undiscovered creators being ignored by traditional streaming platforms. Unlike other platforms that mainly push already-popular streamers, Ligam.tv gives every creator equal visibility through decentralized discovery tools that highlight emerging and niche talent.

## Core Values
- **Fair Discovery for Every Creator**: Equal visibility regardless of follower count
- **Access Over Gatekeeping**: Open platform for all creators
- **Honest Infrastructure**: Transparent systems and fair monetization
- **Productivity First**: Leveraging AI (Eelai) to help creators succeed

## Platform Features
1. **Live Streaming**: Fair discovery for all creators with real-time engagement
2. **Built-in Shop**: Sell digital and physical products directly to your audience
3. **Freelance Marketplace**: Offer your services and skills to clients
4. **Courses**: Create and sell educational content
5. **Multiple Income Streams**: Monetize through subscriptions, tips, products, and services

## Who It's For
- **Streamers**: Go live and build your audience with fair discovery
- **Viewers**: Discover new creators and content you'll love
- **Teachers**: Create and sell courses to share your knowledge
- **Sellers**: Run your shop alongside your content
- **Freelancers**: Offer services and get hired by your community

## Technology
Ligam.tv uses decentralized infrastructure to ensure:
- Creator ownership of content
- Fair algorithmic distribution
- Transparent monetization splits
- Community-driven discovery

## Roadmap
- 2026: Foundation - Launch core platform features
- 2027: Global Reach - Expand to international markets

## Company
- Headquartered in Gothenburg, Sweden
- Built for all creators worldwide
- Platform explicitly designed to be inclusive and accessible

## Eelai AI
Eelai is the AI companion for Ligam.tv users, helping with:
- Content discovery
- News and weather updates
- Platform navigation
- Creator tips and guidance
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");

    // First, try to answer from pre-indexed knowledge
    const knowledge = COMPANY_KNOWLEDGE;

    // If query is about ligam.tv and we have the answer in knowledge base
    const queryLower = query?.toLowerCase() || "";
    const isCompanyQuery = 
      queryLower.includes("ligam") ||
      queryLower.includes("company") ||
      queryLower.includes("mission") ||
      queryLower.includes("platform") ||
      queryLower.includes("eelai") ||
      queryLower.includes("features") ||
      queryLower.includes("who") ||
      queryLower.includes("what is");

    if (isCompanyQuery) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            knowledge,
            source: "indexed",
            query
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For other queries, try to scrape ligam.tv for fresh content
    if (apiKey) {
      try {
        console.log("Searching ligam.tv for:", query);
        
        const response = await fetch("https://api.firecrawl.dev/v1/map", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: "https://ligam.tv",
            search: query,
            limit: 5,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return new Response(
            JSON.stringify({ 
              success: true, 
              data: {
                knowledge,
                relatedUrls: data.links || [],
                source: "live",
                query
              }
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch (crawlError) {
        console.error("Firecrawl error:", crawlError);
      }
    }

    // Fallback to just knowledge base
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          knowledge,
          source: "fallback",
          query
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Company knowledge error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
