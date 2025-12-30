import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, stream_key, app, name } = await req.json();
    
    console.log(`RTMP Webhook received: action=${action}, stream_key=${stream_key || name}, app=${app}`);

    // The stream_key can come as 'stream_key' or 'name' depending on the RTMP server
    const key = stream_key || name;

    if (!key) {
      console.error("No stream key provided");
      return new Response(
        JSON.stringify({ error: "Stream key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the stream by stream_key
    const { data: stream, error: streamError } = await supabase
      .from("streams")
      .select("id, user_id, title, is_live")
      .eq("stream_key", key)
      .single();

    if (streamError || !stream) {
      console.error("Stream not found for key:", key, streamError);
      return new Response(
        JSON.stringify({ error: "Invalid stream key" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found stream: id=${stream.id}, user_id=${stream.user_id}, title=${stream.title}`);

    switch (action) {
      case "on_publish":
      case "publish":
      case "start":
        // Stream is starting - set to live
        const { error: publishError } = await supabase
          .from("streams")
          .update({
            is_live: true,
            started_at: new Date().toISOString(),
            viewer_count: 0,
          })
          .eq("id", stream.id);

        if (publishError) {
          console.error("Error setting stream live:", publishError);
          return new Response(
            JSON.stringify({ error: "Failed to start stream" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Stream ${stream.id} is now LIVE`);
        
        // Create notification for followers (optional enhancement)
        const { data: followers } = await supabase
          .from("followers")
          .select("follower_id")
          .eq("following_id", stream.user_id);

        if (followers && followers.length > 0) {
          const notifications = followers.map((f) => ({
            user_id: f.follower_id,
            title: "Stream Started",
            message: `${stream.title} is now live!`,
            type: "stream",
            link: `/stream/${stream.id}`,
          }));

          await supabase.from("notifications").insert(notifications);
          console.log(`Notified ${followers.length} followers`);
        }

        return new Response(
          JSON.stringify({ success: true, message: "Stream started", stream_id: stream.id }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "on_publish_done":
      case "unpublish":
      case "stop":
        // Stream is ending - set to offline
        const startedAt = stream.is_live ? new Date() : null;
        
        const { error: stopError } = await supabase
          .from("streams")
          .update({
            is_live: false,
            ended_at: new Date().toISOString(),
          })
          .eq("id", stream.id);

        if (stopError) {
          console.error("Error stopping stream:", stopError);
          return new Response(
            JSON.stringify({ error: "Failed to stop stream" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log(`Stream ${stream.id} is now OFFLINE`);

        return new Response(
          JSON.stringify({ success: true, message: "Stream stopped", stream_id: stream.id }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "on_play":
      case "play":
        // Viewer joined - increment count
        const { error: playError } = await supabase.rpc("increment_viewer_count", {
          stream_id: stream.id,
        });

        // If RPC doesn't exist, do a simple update
        if (playError) {
          await supabase
            .from("streams")
            .update({ viewer_count: (stream as any).viewer_count + 1 })
            .eq("id", stream.id);
        }

        console.log(`Viewer joined stream ${stream.id}`);

        return new Response(
          JSON.stringify({ success: true, message: "Viewer joined" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "on_play_done":
      case "play_done":
        // Viewer left - decrement count
        const { error: playDoneError } = await supabase.rpc("decrement_viewer_count", {
          stream_id: stream.id,
        });

        if (playDoneError) {
          const currentCount = Math.max(0, ((stream as any).viewer_count || 1) - 1);
          await supabase
            .from("streams")
            .update({ viewer_count: currentCount })
            .eq("id", stream.id);
        }

        console.log(`Viewer left stream ${stream.id}`);

        return new Response(
          JSON.stringify({ success: true, message: "Viewer left" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "validate":
      case "auth":
        // Just validate the stream key exists
        console.log(`Stream key validated for stream ${stream.id}`);
        return new Response(
          JSON.stringify({ success: true, message: "Stream key valid", stream_id: stream.id }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      default:
        console.log(`Unknown action: ${action}`);
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("RTMP Webhook error:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
