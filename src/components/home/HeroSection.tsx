import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, ShoppingBag, Users, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-[1920px] mx-auto">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Built for Independence</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="text-foreground">Broadcast.</span>
              <br />
              <span className="text-primary">Build.</span>
              <br />
              <span className="text-foreground">Earn.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Stream live, sell your work, teach your craft, or offer services — 
              all from one place. Fair fees. Weekly payouts. Your audience, your rules.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
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

          {/* Right Content - Feature Cards */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Streaming Card */}
              <Link 
                to="/browse" 
                className="group p-6 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Live Streams</h3>
                <p className="text-muted-foreground text-sm">Watch live content from creators worldwide</p>
              </Link>

              {/* Shop Card */}
              <Link 
                to="/shop" 
                className="group p-6 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 mt-8"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Marketplace</h3>
                <p className="text-muted-foreground text-sm">Shop exclusive products from sellers</p>
              </Link>

              {/* Freelance Card */}
              <Link 
                to="/freelance" 
                className="group p-6 bg-card/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Freelancers</h3>
                <p className="text-muted-foreground text-sm">Hire talented professionals</p>
              </Link>

              {/* Courses Card */}
              <Link 
                to="/courses" 
                className="group p-6 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/30 rounded-2xl hover:border-primary transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 mt-8"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Learn Skills</h3>
                <p className="text-muted-foreground text-sm">Courses from expert creators</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;