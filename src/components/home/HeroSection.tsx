import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="pt-20 pb-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1920px] mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-3">
          <span className="text-foreground">Create.</span>
          <span className="text-primary mx-2">Watch.</span>
          <span className="text-foreground">Thrive.</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-5">
          Stream, teach, sell, or discover. Your platform, your way.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/browse">
            <Button size="sm">
              <Play className="w-3.5 h-3.5 mr-1.5" /> Watch Live
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
