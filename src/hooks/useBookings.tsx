import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CreatorAvailability {
  id: string;
  creator_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  creator_id: string;
  learner_id: string;
  course_id: string | null;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  status: string;
  price: number;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch creator availability
export const useCreatorAvailability = (creatorId: string | undefined) => {
  return useQuery({
    queryKey: ["availability", creatorId],
    queryFn: async () => {
      if (!creatorId) return [];

      const { data, error } = await supabase
        .from("creator_availability")
        .select("*")
        .eq("creator_id", creatorId)
        .eq("is_available", true)
        .order("day_of_week", { ascending: true });

      if (error) throw error;
      return data as CreatorAvailability[];
    },
    enabled: !!creatorId,
  });
};

// Fetch own availability (for creator)
export const useOwnAvailability = () => {
  return useQuery({
    queryKey: ["own-availability"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data, error } = await supabase
        .from("creator_availability")
        .select("*")
        .eq("creator_id", session.session.user.id)
        .order("day_of_week", { ascending: true });

      if (error) throw error;
      return data as CreatorAvailability[];
    },
  });
};

// Set availability
export const useSetAvailability = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (slots: { day_of_week: number; start_time: string; end_time: string; is_available?: boolean }[]) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      // Delete existing availability
      await supabase
        .from("creator_availability")
        .delete()
        .eq("creator_id", session.session.user.id);

      if (slots.length === 0) return [];

      // Insert new availability
      const { data, error } = await supabase
        .from("creator_availability")
        .insert(
          slots.map((slot) => ({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_available: slot.is_available ?? true,
            creator_id: session.session.user.id,
          }))
        )
        .select();

      if (error) throw error;
      return data as CreatorAvailability[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["own-availability"] });
      toast({ title: "Availability updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update availability", description: error.message, variant: "destructive" });
    },
  });
};

// Fetch user bookings (as learner)
export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("learner_id", session.session.user.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data as Booking[];
    },
  });
};

// Fetch creator bookings
export const useCreatorBookings = () => {
  return useQuery({
    queryKey: ["creator-bookings"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("creator_id", session.session.user.id)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data as Booking[];
    },
  });
};

// Create booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking: { creator_id: string; title: string; scheduled_at: string; description?: string; course_id?: string; duration_minutes?: number; price?: number }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .insert({
          creator_id: booking.creator_id,
          title: booking.title,
          scheduled_at: booking.scheduled_at,
          description: booking.description,
          course_id: booking.course_id,
          duration_minutes: booking.duration_minutes ?? 60,
          price: booking.price ?? 0,
          learner_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast({ title: "Session booked successfully!" });
    },
    onError: (error) => {
      toast({ title: "Failed to book session", description: error.message, variant: "destructive" });
    },
  });
};

// Update booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, status, meetingUrl }: { bookingId: string; status: string; meetingUrl?: string }) => {
      const updates: Partial<Booking> = { status };
      if (meetingUrl) updates.meeting_url = meetingUrl;

      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["creator-bookings"] });
      toast({ title: "Booking updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update booking", description: error.message, variant: "destructive" });
    },
  });
};

// Cancel booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["creator-bookings"] });
      toast({ title: "Booking cancelled" });
    },
    onError: (error) => {
      toast({ title: "Failed to cancel booking", description: error.message, variant: "destructive" });
    },
  });
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
