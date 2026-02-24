import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Clock, PlayCircle, CheckCircle, TrendingUp, GraduationCap } from "lucide-react";
import { Course } from "@/hooks/useCourses";
import { useCreatorProfile } from "@/hooks/useCreatorProfile";

interface CourseCardProps {
  course: Course;
  showInstructor?: boolean;
}

const CourseCard = ({ course, showInstructor = true }: CourseCardProps) => {
  const navigate = useNavigate();
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

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleInstructorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (creatorProfile?.username) {
      navigate(`/@${creatorProfile.username}`);
    }
  };

  return (
    <Card 
      className="group h-full overflow-hidden bg-card border-border hover:border-muted-foreground/30 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video overflow-hidden">
        {course.thumbnail_url ? (
          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        {isBestseller && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">Top Rated</Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
            <PlayCircle className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </div>
      <CardContent className="p-2.5 space-y-1">
        <h3 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
        {showInstructor && (
          <div 
            className={`flex items-center gap-1.5 ${creatorProfile?.username ? 'hover:opacity-80 cursor-pointer' : ''}`}
            onClick={creatorProfile?.username ? handleInstructorClick : undefined}
          >
            <Avatar className="w-4 h-4">
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{instructor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-muted-foreground truncate">{instructor.name}</span>
            {creatorProfile?.university && (
              <span className="text-[10px] text-muted-foreground truncate flex items-center gap-0.5">
                <GraduationCap className="w-2.5 h-2.5" />
                {creatorProfile.university}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock className="w-2.5 h-2.5" />
          <span>{Math.floor(course.total_duration_minutes / 60)}h</span>
          <span>•</span>
          <span>{course.total_lessons} lessons</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-primary">{formatPrice(course.price)}</span>
          <span className="text-[10px] text-muted-foreground">{course.total_enrollments.toLocaleString()} students</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
