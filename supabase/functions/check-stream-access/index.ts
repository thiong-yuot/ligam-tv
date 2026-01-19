import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-STREAM-ACCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      userId = user?.id || null;
    }

    const { streamId } = await req.json();
    
    if (!streamId) {
      throw new Error("Stream ID is required");
    }

    logStep("Checking access", { streamId, userId });

    // Get stream details
    const { data: stream, error: streamError } = await supabaseAdmin
      .from('streams')
      .select('id, is_paid, access_price, preview_video_url, stream_type, user_id, title')
      .eq('id', streamId)
      .single();

    if (streamError || !stream) {
      throw new Error("Stream not found");
    }

    // If stream is free, grant access
    if (!stream.is_paid || stream.stream_type === 'free') {
      logStep("Stream is free, access granted");
      return new Response(JSON.stringify({ 
        hasAccess: true,
        isPaid: false,
        price: 0,
        previewUrl: stream.preview_video_url
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If user is the streamer, grant access
    if (userId && userId === stream.user_id) {
      logStep("User is the streamer, access granted");
      return new Response(JSON.stringify({ 
        hasAccess: true,
        isPaid: true,
        isOwner: true,
        price: stream.access_price,
        previewUrl: stream.preview_video_url
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If no user logged in, no access to paid stream
    if (!userId) {
      logStep("No user logged in, no access to paid stream");
      return new Response(JSON.stringify({ 
        hasAccess: false,
        isPaid: true,
        price: stream.access_price,
        previewUrl: stream.preview_video_url,
        requiresLogin: true
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check if user has purchased access
    const { data: access } = await supabaseAdmin
      .from('stream_access')
      .select('id, created_at')
      .eq('stream_id', streamId)
      .eq('user_id', userId)
      .single();

    if (access) {
      logStep("User has purchased access", { accessId: access.id });
      return new Response(JSON.stringify({ 
        hasAccess: true,
        isPaid: true,
        hasPurchased: true,
        price: stream.access_price,
        purchasedAt: access.created_at,
        previewUrl: stream.preview_video_url
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // User needs to purchase access
    logStep("User needs to purchase access");
    return new Response(JSON.stringify({ 
      hasAccess: false,
      isPaid: true,
      price: stream.access_price,
      previewUrl: stream.preview_video_url
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
