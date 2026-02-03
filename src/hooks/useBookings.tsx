import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const useCreatorAvailability = (creatorId?: string) => {
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
      return data;
    },
    enabled: !!creatorId,
  });
};

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
      return data;
    },
  });
};

interface AvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available?: boolean;
}

export const useSetAvailability = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (slots: AvailabilitySlot[]) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      await supabase
        .from("creator_availability")
        .delete()
        .eq("creator_id", session.session.user.id);

      if (slots.length === 0) return [];

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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["own-availability"] });
      toast({ title: "Availability updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update availability", description: error.message, variant: "destructive" });
    },
  });
};

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
      return data;
    },
  });
};

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
      return data;
    },
  });
};

interface BookingData {
  creator_id: string;
  title: string;
  scheduled_at: string;
  description?: string;
  course_id?: string;
  duration_minutes?: number;
  price?: number;
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking: BookingData) => {
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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast({ title: "Session booked successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to book session", description: error.message, variant: "destructive" });
    },
  });
};

interface UpdateBookingData {
  bookingId: string;
  status: string;
  meetingUrl?: string;
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, status, meetingUrl }: UpdateBookingData) => {
      const updates: Record<string, string> = { status };
      if (meetingUrl) updates.meeting_url = meetingUrl;

      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["creator-bookings"] });
      toast({ title: "Booking updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update booking", description: error.message, variant: "destructive" });
    },
  });
};

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
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["creator-bookings"] });
      toast({ title: "Booking cancelled" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to cancel booking", description: error.message, variant: "destructive" });
    },
  });
};
