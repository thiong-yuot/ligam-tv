import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFreelancers } from "@/hooks/useFreelancers";

const FreelancersPreview = () => {
  const { data: freelancers = [], isLoading } = useFreelancers();
  const featuredFreelancers = freelancers.slice(0, 2);

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Freelance</h2>
            <p className="text-muted-foreground mt-1">Hire skilled creators for your next project.</p>
          </div>
          <Link to="/freelance">
            <Button variant="outline" size="sm" className="group">
              Find Freelancers
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))
          ) : featuredFreelancers.length > 0 ? (
            featuredFreelancers.map((freelancer) => (
              <Link
                key={freelancer.id}
                to={`/freelance/${freelancer.id}`}
                className="group bg-card border border-border rounded-xl p-4 hover:border-muted-foreground/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={freelancer.avatar_url || undefined} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium text-foreground text-sm truncate">{freelancer.name}</h4>
                      {freelancer.is_verified && <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{freelancer.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {freelancer.total_jobs || 0} jobs
                  </span>
                  {freelancer.hourly_rate && (
                    <span className="text-primary font-medium">${freelancer.hourly_rate}/hr</span>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-card border border-border rounded-xl">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No freelancers yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FreelancersPreview;
