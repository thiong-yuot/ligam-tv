import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Course {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  preview_video_url: string | null;
  price: number;
  category: string | null;
  level: string;
  language: string;
  is_published: boolean;
  is_featured: boolean;
  total_duration_minutes: number;
  total_lessons: number;
  total_enrollments: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  lessons?: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number;
  is_preview: boolean;
  sort_order: number;
  content_type: string;
  resources: any[];
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  stripe_payment_intent_id: string | null;
  amount_paid: number;
  progress_percentage: number;
  completed_lessons: string[];
  is_completed: boolean;
  completed_at: string | null;
  enrolled_at: string;
  last_accessed_at: string;
  course?: Course;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Fetch all published courses
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
      return data as Course[];
    },
  });
};

// Fetch featured courses
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
      return data as Course[];
    },
  });
};

// Fetch course by ID with sections and lessons
export const useCourse = (courseId: string | undefined) => {
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

      // Fetch lessons for each section
      const sectionsWithLessons = await Promise.all(
        (sections || []).map(async (section) => {
          const { data: lessons } = await supabase
            .from("course_lessons")
            .select("*")
            .eq("section_id", section.id)
            .order("sort_order", { ascending: true });

          return { ...section, lessons: lessons || [] } as CourseSection;
        })
      );

      return { ...course, sections: sectionsWithLessons } as Course & { sections: CourseSection[] };
    },
    enabled: !!courseId,
  });
};

// Fetch creator's courses
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
      return data as Course[];
    },
  });
};

// Create course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (course: Omit<Partial<Course>, 'creator_id'> & { title: string }) => {
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
      return data as Course;
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

// Update course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase
        .from("courses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Course;
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

// Delete course
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
    onError: (error) => {
      toast({ title: "Failed to delete course", description: error.message, variant: "destructive" });
    },
  });
};

// Create section
export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: { course_id: string; title: string; description?: string; sort_order?: number }) => {
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
      return data as CourseSection;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.course_id] });
    },
  });
};

// Create lesson
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: { section_id: string; title: string; description?: string; video_url?: string; duration_minutes?: number; is_preview?: boolean; sort_order?: number }) => {
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
      return data as CourseLesson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
    },
  });
};

// User enrollments
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

      // Fetch course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          const { data: course } = await supabase
            .from("courses")
            .select("*")
            .eq("id", enrollment.course_id)
            .single();

          return { ...enrollment, course } as Enrollment;
        })
      );

      return enrollmentsWithCourses;
    },
  });
};

// Check enrollment
export const useCheckEnrollment = (courseId: string | undefined) => {
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
      return data as Enrollment | null;
    },
    enabled: !!courseId,
  });
};

// Enroll in course
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
      return data as Enrollment;
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

// Update lesson progress
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      enrollmentId, 
      lessonId, 
      completedLessons,
      progressPercentage 
    }: { 
      enrollmentId: string; 
      lessonId: string;
      completedLessons: string[];
      progressPercentage: number;
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
      return data as Enrollment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment"] });
    },
  });
};

// Course reviews
export const useCourseReviews = (courseId: string | undefined) => {
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
      return data as CourseReview[];
    },
    enabled: !!courseId,
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (review: { course_id: string; rating: number; review_text?: string }) => {
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
      return data as CourseReview;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", data.course_id] });
      toast({ title: "Review submitted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    },
  });
};

// Course categories
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
