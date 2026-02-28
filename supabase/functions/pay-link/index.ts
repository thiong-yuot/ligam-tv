import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { slug } = await req.json();
    if (!slug) throw new Error("Missing payment link slug");

    // Fetch the payment link
    const { data: link, error } = await supabaseAdmin
      .from("payment_links")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .single();

    if (error || !link) throw new Error("Payment link not found or expired");

    // Get creator profile for description
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("display_name, username")
      .eq("user_id", link.creator_id)
      .single();

    const creatorName = profile?.display_name || profile?.username || "Creator";

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: link.currency || "usd",
            product_data: {
              name: link.description || `Payment to ${creatorName}`,
            },
            unit_amount: Math.round(link.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/pay/${slug}?success=true`,
      cancel_url: `${req.headers.get("origin")}/pay/${slug}?canceled=true`,
      metadata: {
        payment_link_id: link.id,
        payment_link_slug: slug,
        creator_id: link.creator_id,
      },
    });

    // Don't mark as paid yet — the webhook will handle that after successful payment

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[PAY-LINK] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
