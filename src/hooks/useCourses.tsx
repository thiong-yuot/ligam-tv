import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  short_description?: string | null;
  thumbnail_url?: string | null;
  preview_video_url?: string | null;
  price: number;
  category?: string | null;
  level?: string | null;
  language?: string | null;
  creator_id: string;
  is_published?: boolean | null;
  is_featured?: boolean | null;
  total_enrollments?: number | null;
  average_rating?: number | null;
  total_reviews?: number | null;
  total_lessons?: number | null;
  total_duration_minutes?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  sort_order?: number | null;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  section_id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  duration_minutes?: number | null;
  is_preview?: boolean | null;
  sort_order?: number | null;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage?: number | null;
  completed_lessons?: string[] | null;
  is_completed?: boolean | null;
  enrolled_at?: string | null;
  course?: Course | null;
}

export const COURSE_CATEGORIES = [
  "Development",
  "Business",
  "Design",
  "Marketing",
  "Music",
  "Photography",
  "Gaming",
  "Lifestyle",
  "Health",
  "Finance",
];

export const COURSE_LEVELS = ["beginner", "intermediate", "advanced", "all-levels"];

export const useCourses = (category?: string) => {
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

export const useCourse = (courseId?: string) => {
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

interface CourseData {
  title: string;
  description?: string;
  short_description?: string;
  thumbnail_url?: string;
  preview_video_url?: string;
  price?: number;
  category?: string;
  level?: string;
  language?: string;
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: CourseData) => {
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
    onError: (error: Error) => {
      toast({ title: "Failed to create course", description: error.message, variant: "destructive" });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CourseData>) => {
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
    onError: (error: Error) => {
      toast({ title: "Failed to update course", description: error.message, variant: "destructive" });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-courses"] });
      toast({ title: "Course deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete course", description: error.message, variant: "destructive" });
    },
  });
};

interface SectionData {
  course_id: string;
  title: string;
  description?: string;
  sort_order?: number;
}

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: SectionData) => {
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

interface LessonData {
  section_id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration_minutes?: number;
  is_preview?: boolean;
  sort_order?: number;
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: LessonData) => {
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

export const useCheckEnrollment = (courseId?: string) => {
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
    mutationFn: async ({ courseId, amountPaid = 0 }: { courseId: string; amountPaid?: number }) => {
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
    onError: (error: Error) => {
      toast({ title: "Failed to enroll", description: error.message, variant: "destructive" });
    },
  });
};

interface ProgressData {
  enrollmentId: string;
  lessonId: string;
  completedLessons: string[];
  progressPercentage: number;
}

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, completedLessons, progressPercentage }: ProgressData) => {
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

export const useCourseReviews = (courseId?: string) => {
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

interface ReviewData {
  course_id: string;
  rating: number;
  review_text?: string;
}

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review: ReviewData) => {
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
      toast({ title: "Review submitted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    },
  });
};
