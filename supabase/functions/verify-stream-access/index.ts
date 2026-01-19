import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENTAGE = 0.20;

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-STREAM-ACCESS] ${step}${detailsStr}`);
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
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user");
    }

    logStep("User authenticated", { userId: user.id });

    const { sessionId, streamId } = await req.json();
    
    if (!sessionId || !streamId) {
      throw new Error("Session ID and Stream ID are required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    logStep("Session retrieved", { 
      paymentStatus: session.payment_status,
      metadata: session.metadata 
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    if (session.metadata?.stream_id !== streamId) {
      throw new Error("Session does not match stream");
    }

    if (session.metadata?.supabase_user_id !== user.id) {
      throw new Error("Session does not match user");
    }

    // Check if access already granted
    const { data: existingAccess } = await supabaseAdmin
      .from('stream_access')
      .select('id')
      .eq('stream_id', streamId)
      .eq('user_id', user.id)
      .single();

    if (existingAccess) {
      logStep("Access already exists", { accessId: existingAccess.id });
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Access already granted" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const amountPaid = (session.amount_total || 0) / 100;
    const platformFee = parseFloat(session.metadata?.platform_fee || "0");
    const streamerEarnings = parseFloat(session.metadata?.streamer_earnings || "0");
    const streamerId = session.metadata?.streamer_id;

    // Grant access to the stream
    const { error: accessError } = await supabaseAdmin
      .from('stream_access')
      .insert({
        stream_id: streamId,
        user_id: user.id,
        amount_paid: amountPaid,
        platform_fee: platformFee,
        streamer_earnings: streamerEarnings,
        stripe_payment_intent_id: session.payment_intent as string,
      });

    if (accessError) {
      logStep("Error granting access", { error: accessError });
      throw new Error("Failed to grant stream access");
    }

    // Update or create stream earnings record
    const { data: existingEarnings } = await supabaseAdmin
      .from('stream_earnings')
      .select('*')
      .eq('stream_id', streamId)
      .single();

    if (existingEarnings) {
      await supabaseAdmin
        .from('stream_earnings')
        .update({
          total_earnings: existingEarnings.total_earnings + streamerEarnings,
          platform_fees: existingEarnings.platform_fees + platformFee,
          access_count: existingEarnings.access_count + 1,
        })
        .eq('stream_id', streamId);
    } else {
      await supabaseAdmin
        .from('stream_earnings')
        .insert({
          stream_id: streamId,
          streamer_id: streamerId,
          total_earnings: streamerEarnings,
          platform_fees: platformFee,
          access_count: 1,
        });
    }

    // Add to creator's earnings
    await supabaseAdmin
      .from('earnings')
      .insert({
        user_id: streamerId,
        amount: streamerEarnings,
        type: 'stream_access',
        source_id: streamId,
        status: 'available',
      });

    logStep("Access granted successfully", {
      streamId,
      userId: user.id,
      amountPaid,
      platformFee,
      streamerEarnings
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Stream access granted",
      earnings: {
        total: amountPaid,
        platformFee,
        streamerEarnings
      }
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
