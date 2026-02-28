import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, CheckCircle, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFreelancers } from "@/hooks/useFreelancers";
import { useMyFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import BecomeFreelancerDialog from "@/components/BecomeFreelancerDialog";

interface FreelancersPreviewProps {
  compact?: boolean;
}

const FreelancersPreview = ({ compact }: FreelancersPreviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: freelancers = [], isLoading } = useFreelancers();
  const { data: myProfile } = useMyFreelancerProfile();
  const [becomeFreelancerOpen, setBecomeFreelancerOpen] = useState(false);
  const featured = freelancers.slice(0, compact ? 4 : 2);

  const handleJoin = () => {
    if (!user) { navigate("/login?redirect=%2Ffreelance"); return; }
    if (myProfile) navigate("/freelance/dashboard");
    else setBecomeFreelancerOpen(true);
  };

  const content = (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-display font-bold text-foreground">Freelance</h2>
        <div className="flex items-center gap-1">
          {user && !myProfile && (
            <Button variant="outline" size="sm" className="text-xs h-7 px-2 gap-1" onClick={handleJoin}>
              <Briefcase className="w-3 h-3" /> Join
            </Button>
          )}
          <Link to="/freelance">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-2.5 animate-pulse flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1">
                <div className="h-2.5 bg-muted rounded w-2/3 mb-1" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : featured.length > 0 ? (
        <div className="space-y-2">
          {featured.map((f) => (
            <Link key={f.id} to={`/freelance/${f.id}`} className="flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-lg hover:border-muted-foreground/30 transition-colors">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs">{f.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-[11px] font-medium text-foreground truncate">{f.name}</p>
                  {f.is_verified && <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{f.title}</p>
              </div>
              {f.hourly_rate && <p className="text-[11px] text-primary font-bold flex-shrink-0">From ${f.hourly_rate}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-card border border-border rounded-lg">
          <Users className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
          <p className="text-muted-foreground text-xs">No freelancers yet</p>
        </div>
      )}
    </>
  );

  if (compact) return (
    <>
      <div>{content}</div>
      <BecomeFreelancerDialog open={becomeFreelancerOpen} onOpenChange={setBecomeFreelancerOpen} />
    </>
  );

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">{content}</div>
      <BecomeFreelancerDialog open={becomeFreelancerOpen} onOpenChange={setBecomeFreelancerOpen} />
    </section>
  );
};

export default FreelancersPreview;
