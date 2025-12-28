import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature) {
    console.error("No stripe signature found");
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    let event: Stripe.Event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
      console.warn("No webhook secret configured, skipping signature verification");
    }

    console.log("Received webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        
        console.log("Checkout completed for user:", userId);
        console.log("Payment status:", session.payment_status);
        console.log("Mode:", session.mode);

        if (session.mode === "subscription" && userId) {
          // Handle subscription
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          const { error: subError } = await supabaseAdmin.from("subscriptions").insert({
            subscriber_id: userId,
            creator_id: userId, // Self-subscription for premium
            tier: "premium",
            amount: subscription.items.data[0]?.price.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
            is_active: true,
            started_at: new Date().toISOString(),
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          });

          if (subError) {
            console.error("Error creating subscription record:", subError);
          } else {
            console.log("Subscription record created successfully");
          }
        } else if (session.mode === "payment" && userId) {
          // Handle one-time payment (order)
          const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert({
            user_id: userId,
            total_amount: session.amount_total ? session.amount_total / 100 : 0,
            status: "paid",
          }).select().single();

          if (orderError) {
            console.error("Error creating order:", orderError);
          } else {
            console.log("Order created:", order.id);
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get customer to find user ID
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;
        
        const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
        if (!userId) break;

        const isActive = subscription.status === "active";
        
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({ 
            is_active: isActive,
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("subscriber_id", userId)
          .eq("tier", "premium");

        if (error) {
          console.error("Error updating subscription:", error);
        } else {
          console.log("Subscription updated for user:", userId, "Active:", isActive);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice paid:", invoice.id, "Amount:", invoice.amount_paid);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.error("Invoice payment failed:", invoice.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
