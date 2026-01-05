import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";
import CourseCard from "./CourseCard";

const CoursesPreview = () => {
  const { data: courses = [], isLoading } = useFeaturedCourses();

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Learn New Skills
              </h2>
              <p className="text-muted-foreground">
                Courses from top creators
              </p>
            </div>
          </div>
          <Link to="/courses">
            <Button variant="ghost" className="group">
              Browse All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No courses available yet</p>
            <Link to="/courses">
              <Button variant="outline" className="mt-4">
                Explore Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesPreview;
