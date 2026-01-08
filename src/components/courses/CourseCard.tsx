import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, Clock, PlayCircle, Award, TrendingUp } from "lucide-react";
import { Course } from "@/hooks/useCourses";

interface CourseCardProps {
  course: Course;
  showInstructor?: boolean;
}

// Mock instructor data based on creator_id
const getInstructor = (creatorId: string) => {
  const instructors: Record<string, { name: string; avatar: string; title: string }> = {
    "00000000-0000-0000-0000-000000000001": {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      title: "Senior Developer"
    },
    "00000000-0000-0000-0000-000000000002": {
      name: "Marcus Thompson", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      title: "Marketing Expert"
    }
  };
  return instructors[creatorId] || { name: "Instructor", avatar: "", title: "Expert" };
};

const CourseCard = ({ course, showInstructor = true }: CourseCardProps) => {
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  const instructor = getInstructor(course.creator_id);
  const isPopular = course.total_enrollments > 5000;
  const isBestseller = course.average_rating >= 4.7 && course.total_reviews > 500;

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group h-full overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary/50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isBestseller && (
              <Badge className="bg-yellow-500 text-yellow-950 text-xs font-bold">
                Bestseller
              </Badge>
            )}
            {isPopular && !isBestseller && (
              <Badge className="bg-orange-500 text-white text-xs font-bold">
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {course.is_featured && !isBestseller && !isPopular && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Featured
              </Badge>
            )}
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
              <PlayCircle className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {course.title}
          </h3>

          {/* Instructor */}
          {showInstructor && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={instructor.avatar} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">{instructor.name}</span>
              <Award className="w-3 h-3 text-primary flex-shrink-0" />
            </div>
          )}

          {/* Short description */}
          {course.short_description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {course.short_description}
            </p>
          )}

          {/* Rating and stats */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-yellow-500">{course.average_rating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(course.average_rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} 
                />
              ))}
            </div>
            <span className="text-muted-foreground">({course.total_reviews.toLocaleString()})</span>
          </div>

          {/* Course meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{Math.floor(course.total_duration_minutes / 60)}h {course.total_duration_minutes % 60}m</span>
            </div>
            <span className="text-muted-foreground/50">•</span>
            <div className="flex items-center gap-1">
              <PlayCircle className="w-3 h-3" />
              <span>{course.total_lessons} lessons</span>
            </div>
          </div>

          {/* Level badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize px-2 py-0.5">
              {course.level}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {course.category}
            </Badge>
          </div>

          {/* Price - pushed to bottom */}
          <div className="flex items-center justify-between pt-2 mt-auto border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(course.price)}
              </span>
              {course.price > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(course.price * 1.67).toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{course.total_enrollments.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
