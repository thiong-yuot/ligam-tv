import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { useCourses, Course } from "@/hooks/useCourses";

interface FeaturedCoursesWidgetProps {
  creatorId?: string;
}

const FeaturedCoursesWidget = ({ creatorId }: FeaturedCoursesWidgetProps) => {
  const { data: courses = [] } = useCourses();
  
  // Filter by creator if creatorId provided
  const filteredCourses = creatorId 
    ? courses.filter(c => c.creator_id === creatorId).slice(0, 3)
    : courses.slice(0, 3);

  if (filteredCourses.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Featured Courses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredCourses.map((course) => (
          <Link key={course.id} to={`/courses/${course.id}`}>
            <div className="group flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {course.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-primary" />
                    <span>{course.total_enrollments} enrolled</span>
                  </div>
                  <span>•</span>
                  <span>{course.price === 0 ? "Free" : `$${course.price}`}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <Link to="/courses">
          <Button variant="ghost" size="sm" className="w-full mt-2 group">
            View All Courses
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FeaturedCoursesWidget;
