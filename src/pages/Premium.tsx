import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Eye, 
  TrendingUp, 
  Award,
  Clock,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Premium = () => {
  const packages = [
    {
      name: "Spotlight",
      price: "$19",
      duration: "24 hours",
      features: [
        "Featured on homepage",
        "Category top placement",
        "Priority in search",
        "Special badge",
      ],
      popular: false,
    },
    {
      name: "Superstar",
      price: "$49",
      duration: "7 days",
      features: [
        "All Spotlight features",
        "Hero carousel placement",
        "Push notifications",
        "Social media shoutout",
        "Analytics boost report",
      ],
      popular: true,
    },
    {
      name: "Legend",
      price: "$149",
      duration: "30 days",
      features: [
        "All Superstar features",
        "Dedicated promotional banner",
        "Newsletter feature",
        "Custom overlay badge",
        "Priority support",
        "Monthly strategy call",
      ],
      popular: false,
    },
  ];

  const benefits = [
    { icon: Eye, title: "More Visibility", description: "Get seen by more potential viewers" },
    { icon: TrendingUp, title: "Grow Faster", description: "Accelerate your follower growth" },
    { icon: Award, title: "Stand Out", description: "Premium badge shows you're a serious creator" },
    { icon: Clock, title: "Instant Results", description: "Start appearing in featured spots immediately" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Redesigned */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

        <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Get Featured on Ligam.tv</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="text-foreground">Boost.</span>
              <br />
              <span className="text-primary">Grow.</span>
              <br />
              <span className="text-foreground">Shine.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Get premium placement and reach new audiences. Stand out from 
              the crowd with featured spots that put your content front and center.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="xl" className="glow group">
                View Packages
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/browse">
                <Button variant="outline" size="xl">
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Choose Your Package
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select the promotion package that fits your goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`p-8 bg-card border-border relative ${pkg.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-primary">
                      {pkg.price}
                    </span>
                    <span className="text-muted-foreground">/ {pkg.duration}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={pkg.popular ? "default" : "outline"} 
                  className={`w-full ${pkg.popular ? 'glow' : ''}`}
                >
                  Get {pkg.name}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Choose Package", description: "Select the promotion tier that fits your goals" },
              { step: "2", title: "Get Featured", description: "Your stream appears in premium placements" },
              { step: "3", title: "Grow Audience", description: "Watch your viewership and followers increase" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Premium;