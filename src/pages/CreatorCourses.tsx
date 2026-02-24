import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useCreatorCourses, useUpdateCourse, useDeleteCourse, Course } from "@/hooks/useCourses";
import AddCourseDialog from "@/components/courses/AddCourseDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Plus, Eye, EyeOff, Users, Star, Loader2,
  Trash2, Edit, Video, GraduationCap,
} from "lucide-react";

const CreatorCourses = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const { data: courses = [], isLoading } = useCreatorCourses();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate("/auth");
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (authLoading || checking || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleTogglePublish = async (course: Course) => {
    await updateCourse.mutateAsync({ id: course.id, is_published: !course.is_published });
  };

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse.mutateAsync(courseId);
    }
  };

  // No courses yet — show simple CTA
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-8 px-4">
          <div className="container mx-auto max-w-md text-center py-16">
            <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-1">Start Teaching</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Share your knowledge — create your first course and start earning.
            </p>
            <AddCourseDialog>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Create Course
              </Button>
            </AddCourseDialog>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Has courses — show management dashboard
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">My Courses</h1>
            <AddCourseDialog>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                New Course
              </Button>
            </AddCourseDialog>
          </div>

          {/* Course List */}
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-muted-foreground/30 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                    <Badge variant={course.is_published ? "default" : "secondary"} className="text-[10px] h-5">
                      {course.is_published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {course.total_enrollments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" /> {course.average_rating.toFixed(1)}
                    </span>
                    <span>{course.price === 0 ? "Free" : `$${course.price}`}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleTogglePublish(course)}
                    disabled={updateCourse.isPending}
                  >
                    {course.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => navigate(`/creator/courses/${course.id}/edit`)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(course.id)}
                    disabled={deleteCourse.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorCourses;
