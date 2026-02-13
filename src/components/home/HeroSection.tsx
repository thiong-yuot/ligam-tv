import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="pt-16 pb-4 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-display font-bold leading-tight">
          <span className="text-foreground">Create.</span>
          <span className="text-primary mx-1">Watch.</span>
          <span className="text-foreground">Thrive.</span>
        </h1>
        <div className="flex items-center gap-2">
          <Link to="/browse">
            <Button size="sm" variant="default">
              <Play className="w-3 h-3 mr-1" /> Watch Live
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
            Start Creating
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
