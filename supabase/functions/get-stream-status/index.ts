import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-STREAM-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const muxTokenId = Deno.env.get("MUX_TOKEN_ID");
    const muxTokenSecret = Deno.env.get("MUX_TOKEN_SECRET");
    
    if (!muxTokenId || !muxTokenSecret) {
      throw new Error("Mux credentials not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");
    
    const userId = userData.user.id;
    logStep("User authenticated", { userId });

    // Get user's stream
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: stream, error: streamError } = await supabaseAdmin
      .from("streams")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (streamError || !stream) {
      return new Response(JSON.stringify({ hasStream: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!stream.mux_stream_id) {
      return new Response(JSON.stringify({
        hasStream: true,
        stream,
        muxStatus: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get status from Mux
    const muxAuth = btoa(`${muxTokenId}:${muxTokenSecret}`);
    const muxResponse = await fetch(
      `https://api.mux.com/video/v1/live-streams/${stream.mux_stream_id}`,
      {
        headers: {
          "Authorization": `Basic ${muxAuth}`,
        },
      }
    );

    let muxStatus = null;
    if (muxResponse.ok) {
      const muxData = await muxResponse.json();
      muxStatus = muxData.data;
      logStep("Mux status fetched", { status: muxStatus.status });
    }

    return new Response(JSON.stringify({
      hasStream: true,
      stream,
      muxStatus,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
