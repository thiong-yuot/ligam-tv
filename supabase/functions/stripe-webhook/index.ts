import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Platform commission rates
const FREELANCE_COMMISSION = 0.25; // 25% on freelance
const COURSE_COMMISSION = 0.40;    // 40% on courses
const SHOP_COMMISSION = 0.20;      // 20% on shop/store
const LIVE_SESSION_COMMISSION = 0.40; // 40% on paid live sessions
const TIPS_GIFTS_COMMISSION = 0.40;   // 40% on tips & gifts
const SUBSCRIPTION_COMMISSION = 0.40; // 40% on subscriptions
// Affiliate rates (percentage of platform earnings)
const AFFILIATE_RATE_INITIAL = 0.25; // 25% for first 2 months
const AFFILIATE_RATE_RECURRING = 0.15; // 15% after 2 months

// Helper to calculate affiliate commission from platform earnings
const calculateAffiliateCommission = (platformEarnings: number, monthsActive: number): { rate: number; amount: number } => {
  const rate = monthsActive <= 2 ? AFFILIATE_RATE_INITIAL : AFFILIATE_RATE_RECURRING;
  return { rate, amount: platformEarnings * rate };
};

// Helper to process affiliate commission for any purchase
const processAffiliateCommission = async (
  userId: string, 
  platformEarnings: number,
  purchaseType: string
) => {
  // Check if this user was referred
  const { data: referral } = await supabaseAdmin
    .from("referrals")
    .select("*, affiliates(*)")
    .eq("referred_user_id", userId)
    .in("status", ["pending", "converted"])
    .maybeSingle();

  if (!referral) {
    console.log("No referral found for user:", userId);
    return null;
  }

  const monthsActive = referral.months_active || 1;
  const { rate, amount: commissionAmount } = calculateAffiliateCommission(platformEarnings, monthsActive);

  console.log(`Processing affiliate commission for ${purchaseType}:`, {
    userId,
    platformEarnings,
    monthsActive,
    commissionRate: rate,
    commissionAmount
  });

  // Update referral status if pending
  if (referral.status === "pending") {
    await supabaseAdmin
      .from("referrals")
      .update({ 
        status: "converted",
        converted_at: new Date().toISOString(),
        months_active: 1,
        total_commission_earned: commissionAmount,
      })
      .eq("id", referral.id);
  } else {
    await supabaseAdmin
      .from("referrals")
      .update({ 
        total_commission_earned: (referral.total_commission_earned || 0) + commissionAmount,
      })
      .eq("id", referral.id);
  }

  // Create affiliate earning record
  await supabaseAdmin
    .from("affiliate_earnings")
    .insert({
      affiliate_id: referral.affiliate_id,
      referral_id: referral.id,
      amount: commissionAmount,
      commission_rate: rate,
      subscription_month: monthsActive,
      status: "pending",
    });

  // Update affiliate pending earnings
  await supabaseAdmin
    .from("affiliates")
    .update({ 
      pending_earnings: (referral.affiliates?.pending_earnings || 0) + commissionAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", referral.affiliate_id);

  console.log(`Affiliate commission created: $${commissionAmount} (${rate * 100}%) for ${purchaseType}`);
  return { commissionAmount, rate };
};

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
          const subscriptionAmount = subscription.items.data[0]?.price.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0;
          
          const { data: newSub, error: subError } = await supabaseAdmin.from("subscriptions").insert({
            subscriber_id: userId,
            creator_id: userId, // Self-subscription for premium
            tier: "premium",
            amount: subscriptionAmount,
            is_active: true,
            started_at: new Date().toISOString(),
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          }).select().single();

          if (subError) {
            console.error("Error creating subscription record:", subError);
          } else {
            console.log("Subscription record created successfully");
            
            // Platform gets 100% of subscription, affiliate gets % of that
            await processAffiliateCommission(userId, subscriptionAmount, "subscription");
          }
        } else if (session.mode === "payment") {
          const metadata = session.metadata || {};
          const paymentType = metadata.type;
          const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

          // Handle payment link payments - 40% platform commission
          if (metadata.payment_link_id) {
            const PAYMENT_LINK_COMMISSION = 0.40;
            const platformEarnings = totalAmount * PAYMENT_LINK_COMMISSION;
            const creatorEarnings = totalAmount - platformEarnings;

            // Mark payment link as paid
            await supabaseAdmin
              .from("payment_links")
              .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                stripe_payment_intent_id: session.payment_intent as string,
              })
              .eq("id", metadata.payment_link_id);

            // Create creator earnings
            if (metadata.creator_id) {
              await supabaseAdmin.from("earnings").insert({
                user_id: metadata.creator_id,
                amount: creatorEarnings,
                type: "payment_link",
                source_id: metadata.payment_link_id,
                status: "available",
              });
              console.log(`Payment link earnings: $${creatorEarnings} to creator (after ${PAYMENT_LINK_COMMISSION * 100}% commission)`);

              // Notify creator
              await supabaseAdmin.from("notifications").insert({
                user_id: metadata.creator_id,
                type: "earning",
                title: "Payment received!",
                message: `You received $${creatorEarnings.toFixed(2)} from a payment link (${metadata.payment_link_slug})`,
                link: "/payment-links",
              });
            }

            // Process affiliate commission
            if (metadata.creator_id) {
              await processAffiliateCommission(metadata.creator_id, platformEarnings, "payment_link");
            }
          } else if (paymentType === "freelancer_order" && metadata.package_id) {
            // Handle freelancer package order - platform takes 25%
            const platformEarnings = totalAmount * FREELANCE_COMMISSION;
            const freelancerEarnings = totalAmount - platformEarnings;
            
            const { error: orderError } = await supabaseAdmin
              .from("freelancer_orders")
              .update({ 
                status: "pending",
                stripe_payment_intent_id: session.payment_intent as string 
              })
              .eq("package_id", metadata.package_id)
              .eq("client_id", metadata.client_id)
              .eq("status", "pending_payment");

            if (orderError) {
              console.error("Error updating freelancer order:", orderError);
            } else {
              console.log("Freelancer order payment completed");

              // Get freelancer's user_id for earnings
              if (metadata.freelancer_id) {
                const { data: freelancer } = await supabaseAdmin
                  .from("freelancers")
                  .select("user_id")
                  .eq("id", metadata.freelancer_id)
                  .single();

              if (freelancer?.user_id) {
                  // Earnings are HELD until both parties confirm completion
                  await supabaseAdmin.from("earnings").insert({
                    user_id: freelancer.user_id,
                    amount: freelancerEarnings,
                    type: "service",
                    source_id: metadata.package_id,
                    status: "held",
                  });
                  console.log(`Freelancer earnings created: $${freelancerEarnings} (after ${FREELANCE_COMMISSION * 100}% commission)`);
                }
              }
              
              // Process affiliate commission on platform's 25% earnings
              if (metadata.client_id) {
                await processAffiliateCommission(metadata.client_id, platformEarnings, "freelancer_order");
              }
            }
          } else if (paymentType === "course_enrollment" && metadata.course_id) {
            // Handle course enrollment - platform takes 40%
            const platformEarnings = totalAmount * COURSE_COMMISSION;
            const creatorEarnings = totalAmount - platformEarnings;

            const { error: enrollError } = await supabaseAdmin
              .from("enrollments")
              .insert({
                course_id: metadata.course_id,
                user_id: metadata.user_id,
                amount_paid: totalAmount,
                stripe_payment_intent_id: session.payment_intent as string,
              });

            if (enrollError) {
              console.error("Error creating enrollment:", enrollError);
            } else {
              // Update course enrollment count
              await supabaseAdmin.rpc("increment_course_enrollments", { 
                course_id_param: metadata.course_id 
              });
              console.log("Course enrollment created");

              // Create creator earnings record
              if (metadata.creator_id) {
                await supabaseAdmin.from("earnings").insert({
                  user_id: metadata.creator_id,
                  amount: creatorEarnings,
                  type: "course",
                  source_id: metadata.course_id,
                  status: "available",
                });
                console.log(`Course creator earnings: $${creatorEarnings} (after ${COURSE_COMMISSION * 100}% commission)`);
              }
              
              // Process affiliate commission on platform's 40% earnings
              if (metadata.user_id) {
                await processAffiliateCommission(metadata.user_id, platformEarnings, "course_enrollment");
              }
            }
          } else if (paymentType === "stream_access" && metadata.stream_id) {
            // Handle paid stream access - platform takes 40%
            const platformEarnings = totalAmount * LIVE_SESSION_COMMISSION;
            const streamerEarnings = totalAmount - platformEarnings;

            // Grant stream access
            const { error: accessError } = await supabaseAdmin
              .from("stream_access")
              .insert({
                stream_id: metadata.stream_id,
                user_id: metadata.supabase_user_id,
                amount_paid: totalAmount,
                platform_fee: platformEarnings,
                streamer_earnings: streamerEarnings,
                stripe_payment_intent_id: session.payment_intent as string,
              });

            if (accessError) {
              console.error("Error granting stream access:", accessError);
            } else {
              console.log("Stream access granted via webhook");

              // Create streamer earnings
              if (metadata.streamer_id) {
                await supabaseAdmin.from("earnings").insert({
                  user_id: metadata.streamer_id,
                  amount: streamerEarnings,
                  type: "live_session",
                  source_id: metadata.stream_id,
                  status: "available",
                });
                console.log(`Streamer earnings: $${streamerEarnings} (after ${LIVE_SESSION_COMMISSION * 100}% commission)`);
              }

              // Update stream_earnings aggregate
              const { data: existingEarnings } = await supabaseAdmin
                .from("stream_earnings")
                .select("*")
                .eq("stream_id", metadata.stream_id)
                .single();

              if (existingEarnings) {
                await supabaseAdmin
                  .from("stream_earnings")
                  .update({
                    total_earnings: existingEarnings.total_earnings + streamerEarnings,
                    platform_fees: existingEarnings.platform_fees + platformEarnings,
                    access_count: existingEarnings.access_count + 1,
                  })
                  .eq("stream_id", metadata.stream_id);
              } else {
                await supabaseAdmin.from("stream_earnings").insert({
                  stream_id: metadata.stream_id,
                  streamer_id: metadata.streamer_id,
                  total_earnings: streamerEarnings,
                  platform_fees: platformEarnings,
                  access_count: 1,
                });
              }
            }

            if (userId) {
              await processAffiliateCommission(userId, platformEarnings, "stream_access");
            }
          } else if (paymentType === "product_order" || (!paymentType && metadata.seller_ids)) {
            // Handle product order - platform takes 20%
            const platformEarnings = totalAmount * SHOP_COMMISSION;
            
            const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert({
              user_id: userId || metadata.supabase_user_id,
              total_amount: totalAmount,
              status: "paid",
              stripe_payment_intent_id: session.payment_intent as string,
            }).select().single();

            if (orderError) {
              console.error("Error creating order:", orderError);
            } else {
              console.log("Product order created:", order.id);

              // Create earnings for each seller
              const sellerIds = metadata.seller_ids?.split(",").filter(Boolean) || [];
              // Set payment hold for 40 days
              await supabaseAdmin.from("orders").update({
                payment_held_until: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
              }).eq("id", order.id);

              for (const sellerId of sellerIds) {
                const sellerEarnings = totalAmount * (1 - SHOP_COMMISSION) / (sellerIds.length || 1);
                // Earnings are HELD until delivery confirmed (QR scan) or 40-day timeout
                await supabaseAdmin.from("earnings").insert({
                  user_id: sellerId,
                  amount: sellerEarnings,
                  type: "store",
                  source_id: order.id,
                  status: "held",
                });
                console.log(`Seller earnings: $${sellerEarnings} (after ${SHOP_COMMISSION * 100}% commission)`);
              }
              
              // Process affiliate commission on platform's 20% earnings
              const buyerId = userId || metadata.supabase_user_id;
              if (buyerId) {
                await processAffiliateCommission(buyerId, platformEarnings, "product_order");
              }
            }
          } else if (userId) {
            // Generic order fallback
            const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert({
              user_id: userId,
              total_amount: totalAmount,
              status: "paid",
            }).select().single();

            if (orderError) {
              console.error("Error creating order:", orderError);
            } else {
              console.log("Order created:", order.id);
              await processAffiliateCommission(userId, totalAmount, "generic_order");
            }
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
        
        // Handle recurring subscription payments for affiliate commissions
        if (invoice.subscription && invoice.customer) {
          const customerId = invoice.customer as string;
          const customer = await stripe.customers.retrieve(customerId);
          
          if (!customer.deleted) {
            const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
            
            if (userId) {
              // Check if this user was referred
              const { data: referral } = await supabaseAdmin
                .from("referrals")
                .select("*, affiliates(*)")
                .eq("referred_user_id", userId)
                .eq("status", "converted")
                .maybeSingle();
              
              if (referral) {
                const newMonthsActive = (referral.months_active || 0) + 1;
                const invoiceAmount = (invoice.amount_paid || 0) / 100;
                
                // Update months active first
                await supabaseAdmin
                  .from("referrals")
                  .update({ months_active: newMonthsActive })
                  .eq("id", referral.id);
                
                // 25% for first 2 months, 15% after (of platform earnings = full subscription amount)
                const { rate, amount: commissionAmount } = calculateAffiliateCommission(invoiceAmount, newMonthsActive);
                
                // Update referral total commission
                await supabaseAdmin
                  .from("referrals")
                  .update({ 
                    total_commission_earned: (referral.total_commission_earned || 0) + commissionAmount,
                  })
                  .eq("id", referral.id);
                
                // Create affiliate earning record
                await supabaseAdmin
                  .from("affiliate_earnings")
                  .insert({
                    affiliate_id: referral.affiliate_id,
                    referral_id: referral.id,
                    amount: commissionAmount,
                    commission_rate: rate,
                    subscription_month: newMonthsActive,
                    status: "pending",
                  });
                
                // Update affiliate pending earnings
                await supabaseAdmin
                  .from("affiliates")
                  .update({ 
                    pending_earnings: (referral.affiliates?.pending_earnings || 0) + commissionAmount,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", referral.affiliate_id);
                
                console.log(`Recurring affiliate commission: $${commissionAmount} (${rate * 100}%) for month ${newMonthsActive}`);
              }
            }
          }
        }
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
