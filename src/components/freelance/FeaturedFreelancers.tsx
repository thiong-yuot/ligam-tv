import { useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, TrendingUp, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Freelancer } from "@/hooks/useFreelancers";

interface FeaturedFreelancersProps {
  freelancers: Freelancer[];
}

const FeaturedFreelancers = ({ freelancers }: FeaturedFreelancersProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get top rated freelancers
  const topFreelancers = [...freelancers]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (topFreelancers.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Top Rated Creators</h2>
            <p className="text-sm text-muted-foreground">Highly skilled professionals</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => scroll("left")}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => scroll("right")}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
      >
        {topFreelancers.map((freelancer, index) => (
          <div
            key={freelancer.id}
            className="flex-shrink-0 w-[280px] bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/freelance/${freelancer.id}`)}
          >
            {/* Rank Badge */}
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                #{index + 1} Top Rated
              </Badge>
              {freelancer.is_verified && (
                <CheckCircle className="w-5 h-5 text-primary fill-primary" />
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center ring-2 ring-primary/20">
                  <span className="text-sm font-bold text-foreground">{freelancer.name.charAt(0)}</span>
                </div>
                {freelancer.is_available && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {freelancer.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{freelancer.title}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-primary">
                <Briefcase className="w-4 h-4" />
                <span className="font-bold">{freelancer.total_jobs || 0} jobs</span>
              </div>
              {freelancer.hourly_rate && (
                <span className="font-semibold text-foreground">
                  From ${freelancer.hourly_rate}
                </span>
              )}
            </div>

            {/* Skills Preview */}
            {freelancer.skills && freelancer.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {freelancer.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedFreelancers;
