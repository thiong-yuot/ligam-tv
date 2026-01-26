import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pre-indexed company knowledge about Ligam.tv
const COMPANY_KNOWLEDGE = `
# About Ligam.tv

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
- **Fair Discovery for Every Creator**: Equal visibility regardless of follower count
- **Access Over Gatekeeping**: Open platform for all creators
- **Honest Infrastructure**: Transparent systems and fair monetization
- **Productivity First**: Leveraging AI (Eelai) to help creators succeed

## Revenue
Keep 85-92% of your earnings. Weekly payouts. No hidden fees.

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
