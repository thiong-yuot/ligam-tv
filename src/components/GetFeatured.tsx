import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GetFeatured = () => {
  return (
    <section id="get-featured" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-primary fill-primary" />
                <span className="text-primary font-semibold">Premium Feature</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Get Featured
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Boost your visibility with premium placement on our homepage and category pages. Reach more viewers and grow your community faster.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  Premium homepage carousel placement
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  Featured in category pages
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary" />
                  Increased discoverability
                </li>
              </ul>

              <Link to="/premium">
                <Button variant="default" size="lg" className="glow">
                  Buy Promotion
                </Button>
              </Link>
            </div>

            {/* Right - Decorative */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-primary/20 animate-float" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-24 h-24 text-primary animate-glow-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetFeatured;
