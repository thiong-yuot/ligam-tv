import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { packageId, requirements } = await req.json();
    if (!packageId) throw new Error("Package ID is required");

    // Get package details
    const { data: packageData, error: packageError } = await supabaseClient
      .from("freelancer_packages")
      .select("*, freelancers(id, name, user_id)")
      .eq("id", packageId)
      .single();

    if (packageError || !packageData) throw new Error("Package not found");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Calculate platform fee (25% on freelance services)
    const platformFee = Math.round(packageData.price * 100 * 0.25);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageData.name,
              description: packageData.description || `Package from ${packageData.freelancers?.name}`,
            },
            unit_amount: Math.round(packageData.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/freelance/dashboard?payment=success`,
      cancel_url: `${req.headers.get("origin")}/freelance/${packageData.freelancer_id}?payment=cancelled`,
      metadata: {
        type: "freelancer_order",
        package_id: packageId,
        freelancer_id: packageData.freelancer_id,
        freelancer_user_id: packageData.freelancers?.user_id || "",
        client_id: user.id,
        requirements: requirements || "",
        delivery_days: packageData.delivery_days.toString(),
      },
    });

    // Create order record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + packageData.delivery_days);

    await supabaseClient.from("freelancer_orders").insert({
      package_id: packageId,
      freelancer_id: packageData.freelancer_id,
      client_id: user.id,
      total_amount: packageData.price,
      requirements: requirements,
      status: "pending_payment",
      due_date: dueDate.toISOString(),
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
