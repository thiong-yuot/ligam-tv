import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const COURSE_CATEGORIES = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Music",
  "Photography",
  "Gaming",
  "Lifestyle",
];

export const COURSE_LEVELS = ["beginner", "intermediate", "advanced", "all-levels"];

export const useCourses = (category) => {
  return useQuery({
    queryKey: ["courses", category],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ["courses", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("total_enrollments", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });
};

export const useCourse = (courseId) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      if (!courseId) return null;

      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      const { data: sections, error: sectionsError } = await supabase
        .from("course_sections")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order", { ascending: true });

      if (sectionsError) throw sectionsError;

      const sectionsWithLessons = await Promise.all(
        (sections || []).map(async (section) => {
          const { data: lessons } = await supabase
            .from("course_lessons")
            .select("*")
            .eq("section_id", section.id)
            .order("sort_order", { ascending: true });

          return { ...section, lessons: lessons || [] };
        })
      );

      return { ...course, sections: sectionsWithLessons };
    },
    enabled: !!courseId,
  });
};

export const useCreatorCourses = () => {
  return useQuery({
    queryKey: ["creator-courses"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("creator_id", session.session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("courses")
        .insert({
          title: course.title,
          description: course.description,
          short_description: course.short_description,
          thumbnail_url: course.thumbnail_url,
          preview_video_url: course.preview_video_url,
          price: course.price ?? 0,
          category: course.category,
          level: course.level ?? 'beginner',
          language: course.language ?? 'English',
          creator_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-courses"] });
      toast({ title: "Course created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create course", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from("courses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["creator-courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", data.id] });
      toast({ title: "Course updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update course", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (courseId) => {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-courses"] });
      toast({ title: "Course deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete course", description: error.message, variant: "destructive" });
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section) => {
      const { data, error } = await supabase
        .from("course_sections")
        .insert({
          course_id: section.course_id,
          title: section.title,
          description: section.description,
          sort_order: section.sort_order ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.course_id] });
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson) => {
      const { data, error } = await supabase
        .from("course_lessons")
        .insert({
          section_id: lesson.section_id,
          title: lesson.title,
          description: lesson.description,
          video_url: lesson.video_url,
          duration_minutes: lesson.duration_minutes ?? 0,
          is_preview: lesson.is_preview ?? false,
          sort_order: lesson.sort_order ?? 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
};

export const useUserEnrollments = () => {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];

      const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", session.session.user.id)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;

      const enrollmentsWithCourses = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          const { data: course } = await supabase
            .from("courses")
            .select("*")
            .eq("id", enrollment.course_id)
            .single();

          return { ...enrollment, course };
        })
      );

      return enrollmentsWithCourses;
    },
  });
};

export const useCheckEnrollment = (courseId) => {
  return useQuery({
    queryKey: ["enrollment", courseId],
    queryFn: async () => {
      if (!courseId) return null;

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return null;

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", session.session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ courseId, amountPaid = 0 }) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("enrollments")
        .insert({
          course_id: courseId,
          user_id: session.session.user.id,
          amount_paid: amountPaid,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", data.course_id] });
      toast({ title: "Successfully enrolled in course!" });
    },
    onError: (error) => {
      toast({ title: "Failed to enroll", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      enrollmentId, 
      lessonId, 
      completedLessons,
      progressPercentage 
    }) => {
      const { data, error } = await supabase
        .from("enrollments")
        .update({
          completed_lessons: completedLessons,
          progress_percentage: progressPercentage,
          last_accessed_at: new Date().toISOString(),
          is_completed: progressPercentage >= 100,
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
        })
        .eq("id", enrollmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });
    },
  });
};

export const useCourseReviews = (courseId) => {
  return useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      if (!courseId) return [];

      const { data, error } = await supabase
        .from("course_reviews")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("course_reviews")
        .insert({
          course_id: review.course_id,
          rating: review.rating,
          review_text: review.review_text,
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", data.course_id] });
      queryClient.invalidateQueries({ queryKey: ["course", data.course_id] });
      toast({ title: "Review submitted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    },
  });
};
