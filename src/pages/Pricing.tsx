import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Crown } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const creatorPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["Unlimited streaming", "Basic chat", "Standard quality", "1 store product", "1 course"],
    cta: "Current Plan",
    popular: false,
    tier: null,
    priceId: null,
  },
  {
    name: "Creator",
    price: "$15.99",
    period: "/month",
    features: ["Everything in Free", "HD streaming", "Priority support", "Analytics", "3 products", "3 courses"],
    cta: "Subscribe",
    popular: true,
    tier: "creator" as const,
    priceId: SUBSCRIPTION_TIERS.creator.price_id,
  },
  {
    name: "Pro",
    price: "$24.99",
    period: "/month",
    features: ["Everything in Creator", "Paid streams", "4K streaming", "API access", "Unlimited products", "Unlimited courses"],
    cta: "Subscribe",
    popular: false,
    tier: "pro" as const,
    priceId: SUBSCRIPTION_TIERS.pro.price_id,
  },
];

const viewerPlan = {
  name: "Ad-Free",
  price: "$13",
  period: "/month",
  features: ["No ads on streams", "No ads on content", "Support creators"],
  tier: "adfree" as const,
  priceId: SUBSCRIPTION_TIERS.adfree.price_id,
};

const Pricing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier: currentTier, subscribed, isLoading, createSubscriptionCheckout, openCustomerPortal, checkSubscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Subscription successful!", description: "Enjoy your premium features!" });
      checkSubscription();
    } else if (searchParams.get("canceled") === "true") {
      toast({ title: "Subscription canceled", variant: "destructive" });
    }
  }, [searchParams, toast, checkSubscription]);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) { if (!user) navigate("/login"); return; }
    if (!user) { navigate("/login"); return; }
    try { await createSubscriptionCheckout(priceId); } catch { toast({ title: "Error", description: "Please try again.", variant: "destructive" }); }
  };

  const isCurrentPlan = (planTier: string | null) => {
    if (!subscribed && planTier === null) return true;
    return currentTier === planTier;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">Pricing</h1>
            <p className="text-muted-foreground text-sm">Simple plans for creators and viewers.</p>
          </div>

          {/* Viewer Plan */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">For Viewers</h2>
            <div className={`bg-card border rounded-xl p-6 ${isCurrentPlan(viewerPlan.tier) && subscribed ? "border-green-500" : "border-border"}`}>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-foreground">{viewerPlan.price}</span>
                <span className="text-sm text-muted-foreground">{viewerPlan.period}</span>
                <span className="ml-2 text-sm text-muted-foreground">— {viewerPlan.name}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {viewerPlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {isCurrentPlan(viewerPlan.tier) && subscribed ? (
                <Button variant="outline" size="sm" onClick={() => openCustomerPortal()}>Manage</Button>
              ) : (
                <Button size="sm" onClick={() => handleSubscribe(viewerPlan.priceId)} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </Button>
              )}
            </div>
          </div>

          {/* Creator Plans */}
          <h2 className="text-lg font-semibold text-foreground mb-4">For Creators</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {creatorPlans.map((plan) => {
              const isCurrent = isCurrentPlan(plan.tier);
              return (
                <div
                  key={plan.name}
                  className={`bg-card border rounded-xl p-6 ${
                    plan.popular ? "border-primary" : isCurrent && subscribed ? "border-green-500" : "border-border"
                  }`}
                >
                  {isCurrent && subscribed && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 mb-2">
                      <Crown className="w-3 h-3" /> Current
                    </span>
                  )}
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1 mb-4">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent && subscribed ? (
                    <Button variant="outline" size="sm" className="w-full" onClick={() => openCustomerPortal()}>Manage</Button>
                  ) : (
                    <Button variant={plan.popular ? "default" : "outline"} size="sm" className="w-full" onClick={() => handleSubscribe(plan.priceId)} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isCurrent ? "Current" : plan.cta}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Questions? View FAQ →</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
