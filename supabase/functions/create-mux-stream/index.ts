import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STREAM] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const srsHost = Deno.env.get("SRS_SERVER_HOST") || "your-srs-server";
    const rtmpUrl = `rtmp://${srsHost}:1935/live`;

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

    const streamKey = crypto.randomUUID();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: existingStream } = await supabaseAdmin
      .from("streams")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let stream;
    if (existingStream) {
      const { data, error } = await supabaseAdmin
        .from("streams")
        .update({
          title,
          description,
          category_id,
          tags: tags || [],
        })
        .eq("id", existingStream.id)
        .select()
        .single();

      if (error) throw error;
      stream = data;
      logStep("Stream updated", { streamId: stream.id });

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
      const { data, error } = await supabaseAdmin
        .from("streams")
        .insert({
          user_id: userId,
          title,
          description,
          category_id,
          tags: tags || [],
        })
        .select()
        .single();

      if (error) throw error;
      stream = data;
      logStep("Stream created", { streamId: stream.id });

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
