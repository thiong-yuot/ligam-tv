import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartCreating = () => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section className="relative py-20 md:py-28 flex items-center overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />

      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-[1920px] mx-auto">
          {/* Centered Content */}
          <div className="flex flex-col items-center text-center">
            {/* Headline - Horizontal Layout */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-tight mb-6">
              <span className="text-foreground">Create.</span>
              <span className="text-primary mx-4">Watch.</span>
              <span className="text-foreground">Thrive.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10">
              Stream, teach, sell, or discover. Your platform, your way.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/browse">
                <Button size="xl" className="glow group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Live
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" onClick={handleStartCreating}>
                Start Creating
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;