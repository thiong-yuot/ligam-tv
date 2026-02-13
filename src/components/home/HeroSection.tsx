import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-16 md:pt-28 md:pb-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1920px] mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4">
          <span className="text-foreground">Create.</span>
          <span className="text-primary mx-3">Watch.</span>
          <span className="text-foreground">Thrive.</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Stream, teach, sell, or discover. Your platform, your way.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/browse">
            <Button size="lg">
              <Play className="w-4 h-4 mr-2" /> Watch Live
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
            Start Creating
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
