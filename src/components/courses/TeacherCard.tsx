import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, BookOpen, MessageCircle, Heart, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  title: string;
  students: number;
  courses: number;
  rating: number;
  bio?: string;
  specialties?: string[];
  isVerified?: boolean;
}

interface TeacherCardProps {
  teacher: Teacher;
  viewMode?: "grid" | "list";
}

const TeacherCard = ({ teacher, viewMode = "grid" }: TeacherCardProps) => {
  const navigate = useNavigate();

  if (viewMode === "list") {
    return (
      <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-20 h-20 rounded-xl">
              <AvatarImage src={teacher.avatar} className="object-cover" />
              <AvatarFallback className="text-lg bg-primary/10 text-primary rounded-xl">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {teacher.isVerified && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="w-5 h-5 text-primary fill-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {teacher.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{teacher.title}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1 text-primary">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">{teacher.courses} courses</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="font-medium text-foreground">{teacher.students.toLocaleString()}</span>
                <span>students</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium text-foreground">{teacher.courses}</span>
                <span>courses</span>
              </div>
            </div>

            {teacher.specialties && teacher.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {teacher.specialties.slice(0, 4).map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {teacher.specialties.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{teacher.specialties.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Action */}
          <Button className="flex-shrink-0">
            View Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300">
      {/* Header with Avatar */}
      <div className="relative p-4 pb-0">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="w-14 h-14 rounded-xl ring-2 ring-border group-hover:ring-primary/50 transition-all">
              <AvatarImage src={teacher.avatar} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary rounded-xl">
                {teacher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {teacher.name}
              </h3>
              {teacher.isVerified && (
                <CheckCircle className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{teacher.title}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1 text-primary">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">{teacher.courses} courses</span>
          </div>
        </div>

        {/* Student count */}
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span><span className="font-medium text-foreground">{teacher.students.toLocaleString()}</span> students</span>
        </div>

        {/* Specialties */}
        {teacher.specialties && teacher.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {teacher.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {teacher.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{teacher.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Bio snippet */}
        {teacher.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {teacher.bio}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="default" className="flex-1">
            <GraduationCap className="w-4 h-4 mr-2" />
            View Courses
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
