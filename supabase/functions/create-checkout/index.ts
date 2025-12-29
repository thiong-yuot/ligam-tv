import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    // Use service role key for database validation to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Use anon key for auth verification
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

    const { items, mode = "payment", priceId, successUrl, cancelUrl } = await req.json();
    
    console.log("[CREATE-CHECKOUT] Creating checkout session for user:", user.email);
    console.log("[CREATE-CHECKOUT] Mode:", mode, "Items:", items?.length || 1);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
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
      console.log("[CREATE-CHECKOUT] Created new Stripe customer:", customerId);
    }

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (priceId) {
      // Subscription mode with Stripe price ID
      lineItems = [{ price: priceId, quantity: 1 }];
    } else if (items && items.length > 0) {
      // Validate product prices against the database
      console.log("[CREATE-CHECKOUT] Validating product prices against database...");
      
      const validatedItems: CartItem[] = [];
      
      for (const item of items as CartItem[]) {
        // Try to find the product by ID first, then by name
        let query = supabaseAdmin
          .from('products')
          .select('id, name, price, sale_price, is_active');
        
        if (item.id) {
          query = query.eq('id', item.id);
        } else {
          query = query.eq('name', item.name);
        }
        
        const { data: product, error: productError } = await query.single();
        
        if (productError || !product) {
          console.error("[CREATE-CHECKOUT] Product not found:", item.name || item.id);
          throw new Error(`Product not found: ${item.name}`);
        }
        
        if (!product.is_active) {
          console.error("[CREATE-CHECKOUT] Product is not active:", product.name);
          throw new Error(`Product is not available: ${product.name}`);
        }
        
        // Use sale_price if available, otherwise use regular price
        const actualPrice = product.sale_price ?? product.price;
        
        // Compare prices (allow for small floating point differences)
        if (Math.abs(actualPrice - item.price) > 0.01) {
          console.error("[CREATE-CHECKOUT] Price mismatch for product:", product.name, "Expected:", actualPrice, "Received:", item.price);
          throw new Error(`Price mismatch for product: ${product.name}. Please refresh and try again.`);
        }
        
        console.log("[CREATE-CHECKOUT] Price validated for:", product.name, "Price:", actualPrice);
        
        validatedItems.push({
          ...item,
          id: product.id,
          name: product.name,
          price: actualPrice,
        });
      }
      
      console.log("[CREATE-CHECKOUT] All prices validated successfully");
      
      // Create line items with validated prices
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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: mode as "payment" | "subscription",
      success_url: successUrl || `${req.headers.get("origin")}/shop?success=true`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/shop?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    console.log("[CREATE-CHECKOUT] Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[CREATE-CHECKOUT] Error creating checkout session:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
