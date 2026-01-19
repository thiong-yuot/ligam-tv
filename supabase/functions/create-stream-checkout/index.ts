import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLATFORM_FEE_PERCENTAGE = 0.20; // 20% Ligam cut

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STREAM-CHECKOUT] ${step}${detailsStr}`);
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

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { streamId } = await req.json();
    
    if (!streamId) {
      throw new Error("Stream ID is required");
    }

    // Get stream details
    const { data: stream, error: streamError } = await supabaseAdmin
      .from('streams')
      .select('*, profiles:user_id(display_name, username)')
      .eq('id', streamId)
      .single();

    if (streamError || !stream) {
      throw new Error("Stream not found");
    }

    if (!stream.is_paid || stream.access_price <= 0) {
      throw new Error("This stream is free to access");
    }

    // Check if user already has access
    const { data: existingAccess } = await supabaseAdmin
      .from('stream_access')
      .select('id')
      .eq('stream_id', streamId)
      .eq('user_id', user.id)
      .single();

    if (existingAccess) {
      throw new Error("You already have access to this stream");
    }

    logStep("Stream found", { 
      streamId, 
      title: stream.title, 
      price: stream.access_price,
      streamerId: stream.user_id 
    });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      logStep("Created new Stripe customer", { customerId });
    }

    const accessPrice = parseFloat(stream.access_price);
    const platformFee = Math.round(accessPrice * PLATFORM_FEE_PERCENTAGE * 100) / 100;
    const streamerEarnings = accessPrice - platformFee;

    logStep("Price breakdown", {
      accessPrice,
      platformFee,
      streamerEarnings,
      platformFeePercentage: PLATFORM_FEE_PERCENTAGE * 100
    });

    const streamerName = stream.profiles?.display_name || stream.profiles?.username || 'Streamer';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Stream Access: ${stream.title}`,
              description: `Access to ${streamerName}'s live stream. Ligam takes ${PLATFORM_FEE_PERCENTAGE * 100}% platform fee.`,
            },
            unit_amount: Math.round(accessPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/stream/${streamId}?access=granted`,
      cancel_url: `${req.headers.get("origin")}/stream/${streamId}?access=canceled`,
      metadata: {
        supabase_user_id: user.id,
        stream_id: streamId,
        streamer_id: stream.user_id,
        platform_fee: platformFee.toString(),
        streamer_earnings: streamerEarnings.toString(),
        type: "stream_access",
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      breakdown: {
        total: accessPrice,
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
