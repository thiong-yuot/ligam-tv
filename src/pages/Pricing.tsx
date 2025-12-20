import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Unlimited streaming",
      "Basic chat features",
      "Standard video quality",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Creator",
    price: "$9.99",
    period: "/month",
    description: "For growing creators",
    features: [
      "Everything in Free",
      "HD streaming (1080p)",
      "Custom emotes",
      "Priority support",
      "Stream analytics",
      "No ads for viewers",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "$24.99",
    period: "/month",
    description: "For professional streamers",
    features: [
      "Everything in Creator",
      "4K streaming",
      "Custom overlays",
      "API access",
      "Dedicated support",
      "Revenue boost (+10%)",
      "Featured placement",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your streaming journey. All plans include our core features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-card border rounded-2xl p-8 animate-fadeIn ${
                  plan.popular 
                    ? "border-primary glow-sm" 
                    : "border-border"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              Have questions about our plans?
            </p>
            <Link to="/faq">
              <Button variant="ghost">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
