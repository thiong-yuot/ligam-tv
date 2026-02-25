import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, title, message, type } = await req.json();

    if (!email || !title) {
      return new Response(JSON.stringify({ error: "Missing email or title" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not set, skipping email");
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const iconMap: Record<string, string> = {
      follow: "👤",
      message: "💬",
      like: "❤️",
      earning: "💰",
      order: "📦",
      gift: "🎁",
      subscription: "⭐",
    };

    const icon = iconMap[type] || "🔔";

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #fafafa; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">${icon}</span>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #fafafa; text-align: center;">${title}</h2>
        ${message ? `<p style="margin: 0 0 24px; font-size: 14px; color: #a1a1aa; text-align: center; line-height: 1.5;">${message}</p>` : ""}
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://ligam-tv.lovable.app/notifications" style="display: inline-block; padding: 10px 24px; background: #7c3aed; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">View on Ligam</a>
        </div>
        <p style="margin: 32px 0 0; font-size: 11px; color: #52525b; text-align: center;">Ligam TV — You received this because of activity on your account.</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ligam TV <notifications@ligam.tv>",
        to: [email],
        subject: `${icon} ${title}`,
        html: htmlBody,
      }),
    });

    const data = await res.json();
    console.log("Resend response:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending notification email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
