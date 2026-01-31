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
    const { text, action, options = {} } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Define tools based on action
    const tools: any[] = [];
    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "summarize":
        systemPrompt = "You are a text summarization expert. Create concise, informative summaries.";
        userPrompt = `Summarize the following text in ${options.length || "2-3"} sentences:\n\n${text}`;
        tools.push({
          type: "function",
          function: {
            name: "return_summary",
            description: "Return a text summary",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string", description: "The summarized text" },
                keyPoints: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Key points from the text"
                }
              },
              required: ["summary", "keyPoints"]
            }
          }
        });
        break;

      case "sentiment":
        systemPrompt = "You are a sentiment analysis expert. Analyze the emotional tone of text.";
        userPrompt = `Analyze the sentiment of this text:\n\n${text}`;
        tools.push({
          type: "function",
          function: {
            name: "return_sentiment",
            description: "Return sentiment analysis",
            parameters: {
              type: "object",
              properties: {
                sentiment: { type: "string", enum: ["positive", "negative", "neutral", "mixed"] },
                confidence: { type: "number", description: "Confidence score 0-1" },
                emotions: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Detected emotions like happy, sad, angry, etc."
                },
                explanation: { type: "string" }
              },
              required: ["sentiment", "confidence", "explanation"]
            }
          }
        });
        break;

      case "keywords":
        systemPrompt = "You are a keyword extraction expert. Extract relevant keywords and topics.";
        userPrompt = `Extract keywords and topics from this text:\n\n${text}`;
        tools.push({
          type: "function",
          function: {
            name: "return_keywords",
            description: "Return extracted keywords",
            parameters: {
              type: "object",
              properties: {
                keywords: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Main keywords"
                },
                topics: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Main topics/themes"
                },
                category: { type: "string", description: "Suggested content category" }
              },
              required: ["keywords", "topics"]
            }
          }
        });
        break;

      case "moderate":
        systemPrompt = "You are a content moderation expert. Check text for policy violations.";
        userPrompt = `Check this content for moderation issues (spam, hate speech, inappropriate content, etc.):\n\n${text}`;
        tools.push({
          type: "function",
          function: {
            name: "return_moderation",
            description: "Return moderation analysis",
            parameters: {
              type: "object",
              properties: {
                safe: { type: "boolean", description: "Whether content is safe" },
                flags: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Any policy violation flags"
                },
                severity: { type: "string", enum: ["none", "low", "medium", "high"] },
                recommendation: { type: "string" }
              },
              required: ["safe", "severity", "recommendation"]
            }
          }
        });
        break;

      case "improve":
        systemPrompt = "You are a professional writing assistant. Improve text while maintaining its meaning.";
        userPrompt = `Improve this text for clarity, grammar, and engagement:\n\n${text}`;
        tools.push({
          type: "function",
          function: {
            name: "return_improved",
            description: "Return improved text",
            parameters: {
              type: "object",
              properties: {
                improved: { type: "string", description: "The improved text" },
                changes: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "List of changes made"
                }
              },
              required: ["improved", "changes"]
            }
          }
        });
        break;

      default:
        return new Response(JSON.stringify({ 
          error: "Invalid action. Use: summarize, sentiment, keywords, moderate, improve" 
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    console.log(`Processing text analysis action: ${action}`);

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
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: tools[0].function.name } }
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

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    let analysisResult = {};
    if (toolCall?.function?.arguments) {
      analysisResult = JSON.parse(toolCall.function.arguments);
    }

    return new Response(JSON.stringify({ 
      action,
      result: analysisResult 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Text analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
