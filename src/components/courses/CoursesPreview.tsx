import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Users } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";

const CoursesPreview = () => {
  const { data: courses = [], isLoading } = useFeaturedCourses();
  const featuredCourses = courses.slice(0, 2);

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Learn</h2>
            <p className="text-muted-foreground mt-1">Courses from expert creators.</p>
          </div>
          <Link to="/courses">
            <Button variant="outline" size="sm" className="group">
              Browse Courses
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="aspect-video bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))
          ) : featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group bg-card border border-border rounded-xl p-4 hover:border-muted-foreground/30 transition-colors"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-2">{course.title}</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" /> {course.total_enrollments || 0} enrolled
                  </span>
                  <span className="text-primary font-bold">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-card border border-border rounded-xl">
              <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No courses yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
