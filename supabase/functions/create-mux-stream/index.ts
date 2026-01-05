import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-MUX-STREAM] ${step}${detailsStr}`);
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
    logStep("Mux credentials verified");

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

    const { title, description, category_id, tags } = await req.json();
    logStep("Request body parsed", { title, category_id });

    // Create Mux Live Stream
    const muxAuth = btoa(`${muxTokenId}:${muxTokenSecret}`);
    
    const muxResponse = await fetch("https://api.mux.com/video/v1/live-streams", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${muxAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playback_policy: ["public"],
        new_asset_settings: {
          playback_policy: ["public"],
        },
        reduced_latency: true,
        low_latency: true,
      }),
    });

    if (!muxResponse.ok) {
      const errorText = await muxResponse.text();
      logStep("Mux API error", { status: muxResponse.status, error: errorText });
      throw new Error(`Mux API error: ${errorText}`);
    }

    const muxData = await muxResponse.json();
    const liveStream = muxData.data;
    logStep("Mux stream created", { streamId: liveStream.id });

    const streamKey = liveStream.stream_key;
    const playbackId = liveStream.playback_ids?.[0]?.id;
    const rtmpUrl = "rtmps://global-live.mux.com:443/app";
    const hlsUrl = playbackId ? `https://stream.mux.com/${playbackId}.m3u8` : null;

    // Use admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already has a stream
    const { data: existingStream } = await supabaseAdmin
      .from("streams")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let stream;
    if (existingStream) {
      // Update existing stream
      const { data, error } = await supabaseAdmin
        .from("streams")
        .update({
          title,
          description,
          category_id,
          tags: tags || [],
          mux_stream_id: liveStream.id,
          mux_playback_id: playbackId,
          hls_url: hlsUrl,
        })
        .eq("id", existingStream.id)
        .select()
        .single();

      if (error) throw error;
      stream = data;
      logStep("Stream updated", { streamId: stream.id });

      // Update or create stream credentials
      const { error: credError } = await supabaseAdmin
        .from("stream_credentials")
        .upsert({
          stream_id: stream.id,
          stream_key: streamKey,
          rtmp_url: rtmpUrl,
        }, { onConflict: 'stream_id' });

      if (credError) {
        logStep("Error updating credentials", { error: credError });
      }
    } else {
      // Create new stream
      const { data, error } = await supabaseAdmin
        .from("streams")
        .insert({
          user_id: userId,
          title,
          description,
          category_id,
          tags: tags || [],
          mux_stream_id: liveStream.id,
          mux_playback_id: playbackId,
          hls_url: hlsUrl,
        })
        .select()
        .single();

      if (error) throw error;
      stream = data;
      logStep("Stream created", { streamId: stream.id });

      // Create stream credentials
      const { error: credError } = await supabaseAdmin
        .from("stream_credentials")
        .insert({
          stream_id: stream.id,
          stream_key: streamKey,
          rtmp_url: rtmpUrl,
        });

      if (credError) {
        logStep("Error creating credentials", { error: credError });
      }
    }

    return new Response(JSON.stringify({
      stream,
      streamKey,
      rtmpUrl,
      hlsUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
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
