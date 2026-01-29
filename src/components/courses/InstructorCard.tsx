import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Eye, MessageCircle, Briefcase } from "lucide-react";
import { CreatorProfile } from "@/hooks/useCreatorProfile";
import { Skeleton } from "@/components/ui/skeleton";

interface InstructorCardProps {
  creator: CreatorProfile | null;
  isLoading?: boolean;
  totalStudents?: number;
  totalCourses?: number;
}

const InstructorCard = ({ creator, isLoading, totalStudents = 0, totalCourses = 0 }: InstructorCardProps) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creator) {
    return null;
  }

  const displayName = creator.display_name || creator.username || "Instructor";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          Your Instructor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarImage src={creator.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{displayName}</h3>
              {creator.is_verified && (
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            
            {creator.is_verified && (
              <Badge variant="secondary" className="text-xs mb-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Pro
              </Badge>
            )}
            
            {creator.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {creator.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{creator.follower_count.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{totalCourses}</p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{creator.total_views.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
        </div>

        {/* Action */}
        {creator.username && (
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/@${creator.username}`}>
              <MessageCircle className="w-4 h-4 mr-2" />
              View Profile
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
