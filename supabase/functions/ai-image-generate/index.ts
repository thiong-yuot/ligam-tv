import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, style, size = "1024x1024" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build enhanced prompt based on style
    let enhancedPrompt = prompt;
    
    const styleEnhancements: Record<string, string> = {
      thumbnail: "Create a professional, eye-catching thumbnail image. High contrast, bold colors, clear focal point. ",
      avatar: "Create a stylized profile avatar. Clean, professional, memorable. ",
      banner: "Create a wide banner image. Cinematic composition, professional quality. ",
      product: "Create a clean product photography style image. White background, professional lighting. ",
      artistic: "Create an artistic, creative illustration. Unique style, vibrant colors. ",
      minimal: "Create a minimal, clean design. Simple shapes, limited color palette. ",
    };

    if (style && styleEnhancements[style]) {
      enhancedPrompt = styleEnhancements[style] + prompt;
    }

    console.log("Generating image with prompt:", enhancedPrompt);

    // Use Gemini's image generation capability
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          { 
            role: "user", 
            content: `Generate an image: ${enhancedPrompt}. Size: ${size}. Make it high quality and professional.` 
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service quota exceeded." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Image generation error:", response.status, errorText);
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Extract image URL or base64 from response
    const content = result.choices?.[0]?.message?.content;
    
    return new Response(JSON.stringify({ 
      success: true,
      image: content,
      prompt: enhancedPrompt 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
