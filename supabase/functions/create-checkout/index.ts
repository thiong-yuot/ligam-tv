import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Try to get authenticated user (optional for product purchases)
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const { items, mode = "payment", priceId, successUrl, cancelUrl } = await req.json();

    // Subscriptions require authentication
    if (mode === "subscription" && !user?.email) {
      throw new Error("Authentication required for subscriptions");
    }

    console.log("[CREATE-CHECKOUT] Creating checkout session. User:", user?.email || "guest", "Mode:", mode);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // If authenticated, find or create Stripe customer
    let customerId: string | undefined;
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { supabase_user_id: user.id },
        });
        customerId = customer.id;
      }
    }

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (priceId) {
      lineItems = [{ price: priceId, quantity: 1 }];
    } else if (items && items.length > 0) {
      console.log("[CREATE-CHECKOUT] Validating product prices...");

      const validatedItems: CartItem[] = [];

      for (const item of items as CartItem[]) {
        let query = supabaseAdmin
          .from("products")
          .select("id, name, price, sale_price, is_active");

        if (item.id) {
          query = query.eq("id", item.id);
        } else {
          query = query.eq("name", item.name);
        }

        const { data: product, error: productError } = await query.single();

        if (productError || !product) {
          throw new Error(`Product not found: ${item.name}`);
        }

        if (!product.is_active) {
          throw new Error(`Product is not available: ${product.name}`);
        }

        const actualPrice = product.sale_price ?? product.price;

        if (Math.abs(actualPrice - item.price) > 0.01) {
          throw new Error(`Price mismatch for product: ${product.name}. Please refresh and try again.`);
        }

        validatedItems.push({
          ...item,
          id: product.id,
          name: product.name,
          price: actualPrice,
        });
      }

      lineItems = validatedItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
    } else {
      throw new Error("No items or price ID provided");
    }

    // Collect seller IDs from products for earnings tracking
    const sellerIds = new Set<string>();
    const productIds: string[] = [];
    if (items && items.length > 0) {
      for (const item of items as CartItem[]) {
        if (item.id) {
          productIds.push(item.id);
          const { data: product } = await supabaseAdmin
            .from("products")
            .select("seller_id")
            .eq("id", item.id)
            .single();
          if (product?.seller_id) sellerIds.add(product.seller_id);
        }
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: lineItems,
      mode: mode as "payment" | "subscription",
      success_url: successUrl || `${req.headers.get("origin")}/shop?success=true`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/shop?canceled=true`,
      metadata: {
        ...(user ? { supabase_user_id: user.id } : {}),
        type: priceId ? "subscription" : "product_order",
        product_ids: productIds.join(","),
        seller_ids: Array.from(sellerIds).join(","),
      },
    };

    // Attach customer if authenticated, otherwise let Stripe collect email
    if (customerId) {
      sessionParams.customer = customerId;
    }

    // For product purchases, collect shipping address and allow guest email entry
    if (mode === "payment") {
      sessionParams.shipping_address_collection = {
        allowed_countries: [
          "US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "SE",
          "NO", "DK", "BE", "CH", "AT", "IE", "NZ", "JP", "SG", "HK",
          "MX", "BR", "ZA", "NG", "KE", "GH", "IN", "PK", "AE", "SA",
        ],
      };
      // For guest users, let Stripe collect their email
      if (!customerId) {
        sessionParams.customer_creation = "always";
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("[CREATE-CHECKOUT] Session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[CREATE-CHECKOUT] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
