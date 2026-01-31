import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-NOTIFICATION-EMAIL] ${step}${detailsStr}`);
};

interface EmailRequest {
  to: string;
  template: "order_confirmation" | "booking_confirmation" | "new_message" | "course_enrollment" | "freelance_order" | "welcome";
  data: Record<string, any>;
}

const getEmailTemplate = (template: string, data: Record<string, any>): { subject: string; html: string } => {
  switch (template) {
    case "order_confirmation":
      return {
        subject: `Order Confirmation - #${data.orderId?.slice(0, 8) || 'N/A'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Order Confirmed! 🎉</h1>
            <p>Thank you for your purchase, ${data.customerName || 'Customer'}!</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${data.orderId || 'N/A'}</p>
              <p><strong>Total:</strong> $${data.totalAmount || '0.00'}</p>
              <p><strong>Status:</strong> ${data.status || 'Processing'}</p>
            </div>
            <p>We'll notify you when your order ships.</p>
            <p style="color: #666; font-size: 14px;">Thank you for shopping with Ligam!</p>
          </div>
        `,
      };

    case "booking_confirmation":
      return {
        subject: `Booking Confirmed - ${data.title || 'Session'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Booking Confirmed! 📅</h1>
            <p>Your session has been scheduled.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Session:</strong> ${data.title || 'N/A'}</p>
              <p><strong>Date:</strong> ${data.scheduledAt || 'TBD'}</p>
              <p><strong>Duration:</strong> ${data.durationMinutes || 60} minutes</p>
              ${data.meetingUrl ? `<p><strong>Meeting Link:</strong> <a href="${data.meetingUrl}">${data.meetingUrl}</a></p>` : ''}
            </div>
            <p style="color: #666; font-size: 14px;">See you soon!</p>
          </div>
        `,
      };

    case "new_message":
      return {
        subject: `New Message from ${data.senderName || 'Someone'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">You have a new message! 💬</h1>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${data.senderName || 'A user'}</p>
              ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
              <p style="margin-top: 10px;">${data.preview || 'You have a new message waiting for you.'}</p>
            </div>
            <a href="${data.messageUrl || '#'}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Message</a>
          </div>
        `,
      };

    case "course_enrollment":
      return {
        subject: `Welcome to ${data.courseTitle || 'the course'}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">You're Enrolled! 🎓</h1>
            <p>Congratulations on starting your learning journey!</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Course:</strong> ${data.courseTitle || 'N/A'}</p>
              <p><strong>Instructor:</strong> ${data.instructorName || 'N/A'}</p>
              <p><strong>Total Lessons:</strong> ${data.totalLessons || 'N/A'}</p>
            </div>
            <a href="${data.courseUrl || '#'}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Start Learning</a>
          </div>
        `,
      };

    case "freelance_order":
      return {
        subject: `New Order - ${data.packageName || 'Service'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">New Order Received! 💼</h1>
            <p>You have a new freelance order to fulfill.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Package:</strong> ${data.packageName || 'N/A'}</p>
              <p><strong>Client:</strong> ${data.clientName || 'N/A'}</p>
              <p><strong>Amount:</strong> $${data.amount || '0.00'}</p>
              <p><strong>Due Date:</strong> ${data.dueDate || 'TBD'}</p>
              ${data.requirements ? `<p><strong>Requirements:</strong> ${data.requirements}</p>` : ''}
            </div>
            <a href="${data.orderUrl || '#'}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order</a>
          </div>
        `,
      };

    case "welcome":
      return {
        subject: "Welcome to Ligam! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Ligam!</h1>
            <p>Hi ${data.displayName || 'there'}! 👋</p>
            <p>We're excited to have you join our community of creators, learners, and professionals.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>What you can do:</h3>
              <ul>
                <li>📺 Watch live streams and premium content</li>
                <li>📚 Take courses from expert instructors</li>
                <li>🛒 Shop exclusive products</li>
                <li>💼 Hire talented freelancers</li>
              </ul>
            </div>
            <a href="${data.appUrl || '#'}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a>
          </div>
        `,
      };

    default:
      return {
        subject: "Notification from Ligam",
        html: `<p>You have a new notification.</p>`,
      };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      logStep("RESEND_API_KEY not configured - skipping email");
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Email service not configured" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const resend = new Resend(resendKey);
    const { to, template, data }: EmailRequest = await req.json();

    if (!to || !template) {
      throw new Error("Missing required fields: to, template");
    }

    logStep("Processing email", { to, template });

    const { subject, html } = getEmailTemplate(template, data);

    const emailResponse = await resend.emails.send({
      from: "Ligam <notifications@resend.dev>",
      to: [to],
      subject,
      html,
    });

    logStep("Email sent successfully", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
