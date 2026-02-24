import { useNavigate } from "react-router-dom";
import { useCreatorCourses, useUpdateCourse, useDeleteCourse, Course } from "@/hooks/useCourses";
import AddCourseDialog from "@/components/courses/AddCourseDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Eye, EyeOff, Users, Star, Loader2, Trash2, Edit } from "lucide-react";

const DashboardCourses = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading } = useCreatorCourses();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const handleTogglePublish = async (course: Course) => {
    await updateCourse.mutateAsync({ id: course.id, is_published: !course.is_published });
  };

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteCourse.mutateAsync(courseId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Your Courses</p>
        <AddCourseDialog>
          <Button size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Course
          </Button>
        </AddCourseDialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-1.5">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="w-14 h-10 rounded object-cover" />
              ) : (
                <div className="w-14 h-10 rounded bg-muted flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{course.price > 0 ? `$${course.price}` : "Free"}</span>
                  <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{course.total_enrollments}</span>
                  <span className="flex items-center gap-0.5"><Star className="w-3 h-3" />{course.average_rating.toFixed(1)}</span>
                </div>
              </div>
              <Badge variant={course.is_published ? "default" : "secondary"} className="text-[10px]">
                {course.is_published ? "Published" : "Draft"}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleTogglePublish(course)} disabled={updateCourse.isPending}>
                  {course.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/creator/courses/${course.id}/edit`)}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(course.id)} disabled={deleteCourse.isPending}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-lg border border-border">
          <BookOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No courses yet</p>
          <AddCourseDialog>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> Create Your First Course
            </Button>
          </AddCourseDialog>
        </div>
      )}
    </div>
  );
};

export default DashboardCourses;
