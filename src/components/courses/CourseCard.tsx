import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Clock, PlayCircle, CheckCircle, TrendingUp } from "lucide-react";
import { Course } from "@/hooks/useCourses";
import { useCreatorProfile } from "@/hooks/useCreatorProfile";

interface CourseCardProps {
  course: Course;
  showInstructor?: boolean;
}

const CourseCard = ({ course, showInstructor = true }: CourseCardProps) => {
  const { data: creatorProfile } = useCreatorProfile(course.creator_id);
  
  // Use real creator data or fallback
  const instructor = {
    name: creatorProfile?.display_name || creatorProfile?.username || "Instructor",
    avatar: creatorProfile?.avatar_url || "",
    isVerified: creatorProfile?.is_verified || false,
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toFixed(2)}`;
  };

  const isPopular = course.total_enrollments > 5000;
  const isBestseller = course.average_rating >= 4.7 && course.total_reviews > 500;

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group h-full overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary/50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isBestseller && (
              <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                Top Rated
              </Badge>
            )}
            {isPopular && !isBestseller && (
              <Badge className="bg-primary/80 text-primary-foreground text-xs font-bold">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
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
          {showInstructor && creatorProfile?.username && (
            <Link 
              to={`/@${creatorProfile.username}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={instructor.avatar} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate hover:text-primary">{instructor.name}</span>
              {instructor.isVerified && (
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
              )}
            </Link>
          )}
          {showInstructor && !creatorProfile?.username && (
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={instructor.avatar} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">{instructor.name}</span>
            </div>
          )}

          {/* Short description */}
          {course.short_description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {course.short_description}
            </p>
          )}

          {/* Enrollment count */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-primary">{course.total_enrollments.toLocaleString()}</span>
            <span className="text-muted-foreground">students enrolled</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">({course.total_reviews.toLocaleString()} reviews)</span>
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
