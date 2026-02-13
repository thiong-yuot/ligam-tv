import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFreelancers } from "@/hooks/useFreelancers";

const FreelancersPreview = () => {
  const { data: freelancers = [], isLoading } = useFreelancers();
  const featured = freelancers.slice(0, 2);

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-foreground">Freelance</h2>
          <Link to="/freelance">
            <Button variant="ghost" size="sm">View All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featured.map((f) => (
              <Link key={f.id} to={`/freelance/${f.id}`} className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={f.avatar_url || undefined} alt={f.name} />
                    <AvatarFallback className="text-xs">{f.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-medium text-foreground truncate">{f.name}</p>
                      {f.is_verified && <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{f.title}</p>
                  </div>
                </div>
                {f.hourly_rate && <p className="text-xs text-primary font-bold">${f.hourly_rate}/hr</p>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
            <p className="text-muted-foreground text-xs">No freelancers yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FreelancersPreview;
