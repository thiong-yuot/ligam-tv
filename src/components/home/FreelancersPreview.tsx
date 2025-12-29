import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Star, ArrowRight, Briefcase, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFreelancers } from "@/hooks/useFreelancers";

const FreelancersPreview = () => {
  const { data: freelancers = [], isLoading } = useFreelancers();
  const featuredFreelancers = freelancers.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Freelancers Cards */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                ))
              ) : featuredFreelancers.length > 0 ? (
                featuredFreelancers.map((freelancer, index) => (
                  <Link
                    key={freelancer.id}
                    to={`/freelancer/${freelancer.id}`}
                    className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                        <AvatarImage src={freelancer.avatar_url || undefined} alt={freelancer.name} />
                        <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                            {freelancer.name}
                          </h4>
                          {freelancer.is_verified && (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{freelancer.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{freelancer.rating?.toFixed(1) || "New"}</span>
                      </div>
                      {freelancer.hourly_rate && (
                        <span className="text-xs font-medium text-primary">
                          ${freelancer.hourly_rate}/hr
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-card border border-border rounded-xl">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No freelancers available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Freelance Hub</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Hire Talented Professionals
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with skilled freelancers for any project. From design to development, 
              find the perfect match for your needs.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                </div>
                <span>Verified professionals in every field</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-blue-500" />
                </div>
                <span>Transparent ratings and reviews</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </div>
                <span>Secure payments and contracts</span>
              </li>
            </ul>

            <div className="flex gap-4 pt-4">
              <Link to="/freelance">
                <Button size="lg" className="group">
                  Find Freelancers
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/freelancer-dashboard">
                <Button variant="outline" size="lg">
                  Become a Freelancer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelancersPreview;
