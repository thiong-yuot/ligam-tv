import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const Premium = () => {
  const packages = [
    {
      name: "Spotlight",
      price: "$19",
      duration: "24 hours",
      features: ["Featured on homepage", "Category top placement", "Priority in search", "Special badge"],
      popular: false,
    },
    {
      name: "Superstar",
      price: "$49",
      duration: "7 days",
      features: ["All Spotlight features", "Hero carousel placement", "Push notifications", "Social media shoutout", "Analytics boost report"],
      popular: true,
    },
    {
      name: "Legend",
      price: "$149",
      duration: "30 days",
      features: ["All Superstar features", "Dedicated promo banner", "Newsletter feature", "Custom overlay badge", "Priority support", "Monthly strategy call"],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <h1 className="text-lg font-display font-bold text-foreground">Get Featured</h1>
          </div>
          <p className="text-xs text-muted-foreground mb-6">Boost your visibility with premium placement packages.</p>

          <div className="space-y-3 mb-6">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`p-4 rounded-lg border ${pkg.popular ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                      {pkg.popular && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Popular</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{pkg.price} / {pkg.duration}</p>
                  </div>
                  <Button size="sm" variant={pkg.popular ? "default" : "outline"} className="h-7 text-[11px]">
                    Get {pkg.name}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {pkg.features.map((f) => (
                    <span key={f} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Check className="w-2.5 h-2.5 text-primary" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Want to explore the platform first?</p>
            <Link to="/browse" className="text-xs text-primary hover:underline font-medium">Browse Streams</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
