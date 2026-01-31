import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYTICS-DASHBOARD] ${step}${detailsStr}`);
};

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Get auth header and validate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    logStep("User authenticated", { userId: user.id });

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "overview";
    const userId = url.searchParams.get("user_id") || user.id;
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");

    logStep("Fetching analytics", { type, userId });

    let analytics: any = {};

    if (type === "overview" || type === "all") {
      // Platform-wide stats (for admins) or user-specific stats
      const [
        { count: totalUsers },
        { count: totalStreams },
        { count: totalCourses },
        { count: totalProducts },
        { count: totalFreelancers },
        { data: recentOrders },
        { data: recentEnrollments },
        { data: recentBookings },
      ] = await Promise.all([
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("streams").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabaseAdmin.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabaseAdmin.from("freelancers").select("*", { count: "exact", head: true }).eq("is_available", true),
        supabaseAdmin.from("orders").select("total_amount, created_at, status").order("created_at", { ascending: false }).limit(100),
        supabaseAdmin.from("enrollments").select("amount_paid, enrolled_at").order("enrolled_at", { ascending: false }).limit(100),
        supabaseAdmin.from("bookings").select("price, scheduled_at, status").order("scheduled_at", { ascending: false }).limit(100),
      ]);

      // Calculate revenue
      const orderRevenue = recentOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const courseRevenue = recentEnrollments?.reduce((sum, e) => sum + (e.amount_paid || 0), 0) || 0;
      const bookingRevenue = recentBookings?.filter(b => b.status === "confirmed").reduce((sum, b) => sum + (b.price || 0), 0) || 0;

      analytics.overview = {
        totalUsers: totalUsers || 0,
        totalStreams: totalStreams || 0,
        totalCourses: totalCourses || 0,
        totalProducts: totalProducts || 0,
        totalFreelancers: totalFreelancers || 0,
        revenue: {
          orders: orderRevenue,
          courses: courseRevenue,
          bookings: bookingRevenue,
          total: orderRevenue + courseRevenue + bookingRevenue,
        },
        recentActivity: {
          orders: recentOrders?.length || 0,
          enrollments: recentEnrollments?.length || 0,
          bookings: recentBookings?.length || 0,
        },
      };
    }

    if (type === "creator" || type === "all") {
      // Creator-specific analytics
      const [
        { data: creatorStreams },
        { data: creatorCourses },
        { data: creatorEarnings },
        { data: streamAccess },
        { data: followers },
      ] = await Promise.all([
        supabaseAdmin.from("streams").select("id, title, viewer_count, peak_viewers, total_views, is_live").eq("user_id", userId),
        supabaseAdmin.from("courses").select("id, title, total_enrollments, average_rating, price").eq("creator_id", userId),
        supabaseAdmin.from("earnings").select("amount, type, created_at, status").eq("user_id", userId),
        supabaseAdmin.from("stream_access").select("amount_paid, streamer_earnings, platform_fee").eq("stream_id", userId),
        supabaseAdmin.from("followers").select("id").eq("following_id", userId),
      ]);

      const totalEarnings = creatorEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const pendingEarnings = creatorEarnings?.filter(e => e.status === "pending").reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const totalViews = creatorStreams?.reduce((sum, s) => sum + (s.total_views || 0), 0) || 0;
      const totalEnrollments = creatorCourses?.reduce((sum, c) => sum + (c.total_enrollments || 0), 0) || 0;

      analytics.creator = {
        streams: {
          total: creatorStreams?.length || 0,
          live: creatorStreams?.filter(s => s.is_live).length || 0,
          totalViews,
          peakViewers: Math.max(...(creatorStreams?.map(s => s.peak_viewers || 0) || [0])),
        },
        courses: {
          total: creatorCourses?.length || 0,
          totalEnrollments,
          averageRating: creatorCourses?.length 
            ? creatorCourses.reduce((sum, c) => sum + (c.average_rating || 0), 0) / creatorCourses.length 
            : 0,
        },
        earnings: {
          total: totalEarnings,
          pending: pendingEarnings,
          paid: totalEarnings - pendingEarnings,
        },
        followers: followers?.length || 0,
      };
    }

    if (type === "seller" || type === "all") {
      // Seller-specific analytics
      const [
        { data: sellerProducts },
        { data: sellerOrders },
      ] = await Promise.all([
        supabaseAdmin.from("products").select("id, name, price, stock_quantity, is_active").eq("seller_id", userId),
        supabaseAdmin.from("orders").select("id, total_amount, status, created_at, product_id").eq("user_id", userId),
      ]);

      const totalSales = sellerOrders?.filter(o => o.status === "paid" || o.status === "shipped" || o.status === "delivered")
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      analytics.seller = {
        products: {
          total: sellerProducts?.length || 0,
          active: sellerProducts?.filter(p => p.is_active).length || 0,
          outOfStock: sellerProducts?.filter(p => (p.stock_quantity || 0) <= 0).length || 0,
        },
        orders: {
          total: sellerOrders?.length || 0,
          pending: sellerOrders?.filter(o => o.status === "pending").length || 0,
          completed: sellerOrders?.filter(o => o.status === "delivered").length || 0,
        },
        revenue: totalSales,
      };
    }

    if (type === "freelancer" || type === "all") {
      // Freelancer-specific analytics
      const { data: freelancerProfile } = await supabaseAdmin
        .from("freelancers")
        .select("id, rating, total_jobs")
        .eq("user_id", userId)
        .maybeSingle();

      if (freelancerProfile) {
        const [
          { data: freelancerOrders },
          { data: freelancerPackages },
        ] = await Promise.all([
          supabaseAdmin.from("freelancer_orders")
            .select("id, total_amount, status, created_at")
            .eq("freelancer_id", freelancerProfile.id),
          supabaseAdmin.from("freelancer_packages")
            .select("id, name, price")
            .eq("freelancer_id", freelancerProfile.id),
        ]);

        const completedOrders = freelancerOrders?.filter(o => o.status === "completed") || [];
        const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

        analytics.freelancer = {
          profile: {
            rating: freelancerProfile.rating || 0,
            totalJobs: freelancerProfile.total_jobs || 0,
          },
          packages: freelancerPackages?.length || 0,
          orders: {
            total: freelancerOrders?.length || 0,
            pending: freelancerOrders?.filter(o => o.status === "pending").length || 0,
            inProgress: freelancerOrders?.filter(o => o.status === "in_progress").length || 0,
            completed: completedOrders.length,
          },
          revenue: totalRevenue,
        };
      }
    }

    logStep("Analytics fetched successfully", { type });

    return new Response(JSON.stringify(analytics), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error.message === "Unauthorized" ? 401 : 500,
    });
  }
});
