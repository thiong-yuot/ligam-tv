import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ShoppingBag, Users, Sparkles, GraduationCap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Start Your Journey Today</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
            Ready to Join the
            <span className="text-primary"> Creator Economy</span>?
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you want to stream, sell, or freelance, Ligam has everything you need to succeed. 
            Join creators already thriving on our platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/create-profile">
              <Button size="xl" className="glow group">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="xl">
                Explore Platform
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <Link 
              to="/go-live" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start Streaming</span>
            </Link>
            <Link 
              to="/seller/dashboard" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Sell Products</span>
            </Link>
            <Link 
              to="/freelance" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Offer Services</span>
            </Link>
            <Link 
              to="/courses" 
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learn Skills</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
