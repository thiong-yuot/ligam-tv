import { supabase } from "@/integrations/supabase/client";

const sendNotificationEmail = async (to, template, data) => {
  try {
    const { data: result, error } = await supabase.functions.invoke("send-notification-email", {
      body: { to, template, data },
    });

    if (error) {
      console.error("Email notification error:", error);
      return { success: false, error };
    }

    return result;
  } catch (error) {
    console.error("Email notification error:", error);
    return { success: false, error };
  }
};

export const sendOrderConfirmation = async (email, orderData) => {
  return sendNotificationEmail(email, "order_confirmation", {
    orderId: orderData.id,
    customerName: orderData.customerName,
    totalAmount: orderData.totalAmount,
    status: orderData.status || "Processing",
  });
};

export const sendBookingConfirmation = async (email, bookingData) => {
  return sendNotificationEmail(email, "booking_confirmation", {
    title: bookingData.title,
    scheduledAt: bookingData.scheduledAt,
    durationMinutes: bookingData.durationMinutes,
    meetingUrl: bookingData.meetingUrl,
  });
};

export const sendNewMessageNotification = async (email, messageData) => {
  return sendNotificationEmail(email, "new_message", {
    senderName: messageData.senderName,
    subject: messageData.subject,
    preview: messageData.preview,
    messageUrl: messageData.messageUrl,
  });
};

export const sendCourseEnrollmentEmail = async (email, enrollmentData) => {
  return sendNotificationEmail(email, "course_enrollment", {
    courseTitle: enrollmentData.courseTitle,
    instructorName: enrollmentData.instructorName,
    totalLessons: enrollmentData.totalLessons,
    courseUrl: enrollmentData.courseUrl,
  });
};

export const sendFreelanceOrderEmail = async (email, orderData) => {
  return sendNotificationEmail(email, "freelance_order", {
    packageName: orderData.packageName,
    clientName: orderData.clientName,
    amount: orderData.amount,
    dueDate: orderData.dueDate,
    requirements: orderData.requirements,
    orderUrl: orderData.orderUrl,
  });
};

export const sendWelcomeEmail = async (email, userData) => {
  return sendNotificationEmail(email, "welcome", {
    displayName: userData.displayName,
    appUrl: userData.appUrl || window.location.origin,
  });
};

export default {
  sendOrderConfirmation,
  sendBookingConfirmation,
  sendNewMessageNotification,
  sendCourseEnrollmentEmail,
  sendFreelanceOrderEmail,
  sendWelcomeEmail,
};
