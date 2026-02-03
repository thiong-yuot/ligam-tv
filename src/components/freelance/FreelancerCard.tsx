import { useNavigate } from "react-router-dom";
import { DollarSign, CheckCircle, MessageCircle, Heart, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Freelancer } from "@/hooks/useFreelancers";

interface FreelancerCardProps {
  freelancer: Freelancer;
  viewMode?: "grid" | "list";
}

const FreelancerCard = ({ freelancer, viewMode = "grid" }: FreelancerCardProps) => {
  const navigate = useNavigate();

  if (viewMode === "list") {
    return (
      <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={freelancer.avatar_url || "/placeholder.svg"}
              alt={freelancer.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            {freelancer.is_available && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
            )}
            {freelancer.is_verified && (
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
                  {freelancer.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">{freelancer.title}</p>
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
                <span className="font-medium">{freelancer.total_jobs || 0} jobs</span>
              </div>
              {freelancer.hourly_rate && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium text-foreground">${freelancer.hourly_rate}</span>/hr
                </div>
              )}
            </div>

            {freelancer.skills && freelancer.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {freelancer.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {freelancer.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{freelancer.skills.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Action */}
          <Button
            onClick={() => navigate(`/freelance/${freelancer.id}`)}
            className="flex-shrink-0"
          >
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
            <img
              src={freelancer.avatar_url || "/placeholder.svg"}
              alt={freelancer.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
            />
            {freelancer.is_available && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {freelancer.name}
              </h3>
              {freelancer.is_verified && (
                <CheckCircle className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{freelancer.title}</p>
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
            <span className="font-medium">{freelancer.total_jobs || 0} jobs</span>
          </div>
          {freelancer.hourly_rate && (
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-foreground">${freelancer.hourly_rate}</span>
              <span className="text-muted-foreground text-xs">/hr</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {freelancer.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {freelancer.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{freelancer.skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Bio snippet */}
        {freelancer.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {freelancer.bio}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => navigate(`/freelance/${freelancer.id}`)}
          >
            View Profile
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
