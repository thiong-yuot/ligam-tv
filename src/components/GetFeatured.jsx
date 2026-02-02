import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GetFeatured = () => {
  return (
    <section id="get-featured" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-primary font-semibold">Premium Feature</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Get Seen First
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Premium placement puts your stream front-and-center on the homepage and category pages — more eyes, more followers, faster growth.
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

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-xl bg-muted flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-muted-foreground" />
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
