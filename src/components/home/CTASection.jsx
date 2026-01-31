import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ShoppingBag, Users, Sparkles, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CTASection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthLink = (path) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden bg-muted/30">
      
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-muted border border-border text-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-medium">Free to Start</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
            Your Platform,
            <span className="text-primary"> Your Way</span>
          </h2>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Stream if you want. Watch if you prefer. Sell, teach, or hire talent. 
            Ligam.tv is built for all creators—not just the ones chasing live audiences. 
            Zero monthly fees, pay only when you earn.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-2 md:pt-4">
            <Link to="/signup">
              <Button size="lg" className="glow group">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">
                Explore Platform
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6 md:pt-8">
            <button 
              onClick={() => handleAuthLink("/go-live")}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start Streaming</span>
            </button>
            <button 
              onClick={() => handleAuthLink("/seller/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Sell Products</span>
            </button>
            <button 
              onClick={() => handleAuthLink("/freelance/dashboard")}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Offer Services</span>
            </button>
            <button 
              onClick={() => handleAuthLink("/creator/courses")}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teach Skills</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
