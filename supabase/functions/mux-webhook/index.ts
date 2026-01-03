import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MUX-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const body = await req.json();
    const { type, data } = body;
    logStep("Event type", { type });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const muxStreamId = data?.id || data?.live_stream_id;
    if (!muxStreamId) {
      logStep("No stream ID in webhook data");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find stream by mux_stream_id
    const { data: stream, error: streamError } = await supabaseAdmin
      .from("streams")
      .select("*")
      .eq("mux_stream_id", muxStreamId)
      .maybeSingle();

    if (streamError || !stream) {
      logStep("Stream not found", { muxStreamId });
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Stream found", { streamId: stream.id });

    switch (type) {
      case "video.live_stream.active":
        logStep("Stream went active");
        await supabaseAdmin
          .from("streams")
          .update({
            is_live: true,
            started_at: new Date().toISOString(),
            viewer_count: 0,
          })
          .eq("id", stream.id);
        break;

      case "video.live_stream.idle":
        logStep("Stream went idle");
        await supabaseAdmin
          .from("streams")
          .update({
            is_live: false,
            ended_at: new Date().toISOString(),
          })
          .eq("id", stream.id);
        break;

      case "video.live_stream.disconnected":
        logStep("Stream disconnected");
        await supabaseAdmin
          .from("streams")
          .update({
            is_live: false,
            ended_at: new Date().toISOString(),
          })
          .eq("id", stream.id);
        break;

      case "video.asset.ready":
        logStep("VOD asset ready", { assetId: data.id });
        // Could store VOD reference here
        break;

      default:
        logStep("Unhandled event type", { type });
    }

    return new Response(JSON.stringify({ received: true }), {
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
