import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Crown } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

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
      "Full freelance access",
      "1 store product",
      "1 course",
    ],
    cta: "Current Plan",
    popular: false,
    tier: null,
    priceId: null,
  },
  {
    name: "Creator",
    price: "$15.99",
    period: "/month",
    description: "For growing creators",
    features: [
      "Everything in Free",
      "HD streaming (1080p)",
      "Custom emotes",
      "Priority support",
      "Stream analytics",
      "No ads for viewers",
      "Max 3 store products",
      "Full freelance access",
      "Max 3 courses",
    ],
    cta: "Subscribe Now",
    popular: true,
    tier: "creator" as const,
    priceId: SUBSCRIPTION_TIERS.creator.price_id,
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
      "Unlimited store products",
      "Full freelance access",
      "Unlimited courses",
    ],
    cta: "Subscribe Now",
    popular: false,
    tier: "pro" as const,
    priceId: SUBSCRIPTION_TIERS.pro.price_id,
  },
];

const Pricing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier: currentTier, subscribed, isLoading, createSubscriptionCheckout, openCustomerPortal, checkSubscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Subscription successful!",
        description: "Welcome to your new plan. Enjoy your premium features!",
      });
      checkSubscription();
    } else if (searchParams.get("canceled") === "true") {
      toast({
        title: "Subscription canceled",
        description: "Your subscription was not completed.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      // Free plan - just redirect to auth if not logged in
      if (!user) {
        navigate("/login");
      }
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      await createSubscriptionCheckout(priceId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isCurrentPlan = (planTier: string | null) => {
    if (!subscribed && planTier === null) return true;
    return currentTier === planTier;
  };

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
            {pricingPlans.map((plan, index) => {
              const isCurrent = isCurrentPlan(plan.tier);
              
              return (
                <div
                  key={plan.name}
                  className={`relative bg-card border rounded-2xl p-8 animate-fadeIn ${
                    plan.popular 
                      ? "border-primary glow-sm" 
                      : isCurrent 
                        ? "border-green-500" 
                        : "border-border"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.popular && !isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                      Most Popular
                    </span>
                  )}
                  
                  {isCurrent && subscribed && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Your Plan
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

                  {isCurrent && subscribed ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      size="lg"
                      onClick={() => openCustomerPortal()}
                    >
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button 
                      variant={plan.popular ? "default" : "outline"} 
                      className="w-full"
                      size="lg"
                      onClick={() => handleSubscribe(plan.priceId)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isCurrent ? (
                        "Current Plan"
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
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
