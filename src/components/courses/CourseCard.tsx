import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, PlayCircle } from "lucide-react";
import { Course } from "@/hooks/useCourses";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary/50" />
            </div>
          )}
          
          {course.is_featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          
          <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            {formatPrice(course.price)}
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            {course.short_description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {course.short_description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>{course.average_rating.toFixed(1)}</span>
              <span>({course.total_reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{course.total_enrollments}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{course.total_lessons} lessons</span>
            </div>
            <Badge variant="secondary" className="text-xs capitalize">
              {course.level}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
