import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Clock,
  Gift,
  Settings,
  BarChart3,
  Play,
  Calendar,
  Loader2,
  Crown,
  Sparkles,
  Check,
  X,
  Zap,
  Code
} from "lucide-react";

const Dashboard = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { tier, subscribed, subscriptionEnd, isLoading: subLoading } = useSubscription();
  const { hasAccess } = useFeatureAccess();

  const tierFeatures = {
    free: {
      name: "Free",
      icon: Zap,
      color: "text-muted-foreground",
      bgColor: "bg-secondary",
      features: [
        { name: "720p Streaming", included: true },
        { name: "Basic Chat", included: true },
        { name: "Community Access", included: true },
        { name: "HD Streaming", included: false },
        { name: "Custom Emotes", included: false },
        { name: "Priority Support", included: false },
        { name: "No Ads for Viewers", included: false },
        { name: "4K Streaming", included: false },
        { name: "API Access", included: false },
      ],
    },
    creator: {
      name: "Creator",
      icon: Sparkles,
      color: "text-primary",
      bgColor: "bg-gradient-to-r from-primary/20 to-purple-500/20",
      features: [
        { name: "720p Streaming", included: true },
        { name: "Basic Chat", included: true },
        { name: "Community Access", included: true },
        { name: "HD Streaming", included: true },
        { name: "Custom Emotes", included: true },
        { name: "Priority Support", included: true },
        { name: "No Ads for Viewers", included: true },
        { name: "4K Streaming", included: false },
        { name: "API Access", included: false },
      ],
    },
    pro: {
      name: "Pro",
      icon: Crown,
      color: "text-amber-500",
      bgColor: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
      features: [
        { name: "720p Streaming", included: true },
        { name: "Basic Chat", included: true },
        { name: "Community Access", included: true },
        { name: "HD Streaming", included: true },
        { name: "Custom Emotes", included: true },
        { name: "Priority Support", included: true },
        { name: "No Ads for Viewers", included: true },
        { name: "4K Streaming", included: true },
        { name: "API Access", included: true },
      ],
    },
  };

  const currentTier = tierFeatures[tier || "free"];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: "Total Views", value: "12,450", change: "+12%", icon: Eye },
    { label: "Followers", value: "1,234", change: "+8%", icon: Users },
    { label: "Watch Time", value: "48h", change: "+15%", icon: Clock },
    { label: "Earnings", value: "$245.00", change: "+23%", icon: DollarSign },
  ];

  const recentStreams = [
    { title: "Gaming Night - Episode 23", date: "2 days ago", views: 1250, duration: "3h 45m" },
    { title: "Music Production Live", date: "5 days ago", views: 890, duration: "2h 30m" },
    { title: "Q&A with Viewers", date: "1 week ago", views: 2100, duration: "1h 15m" },
  ];

  const quickActions = [
    { label: "Go Live", icon: Play, path: "/go-live", primary: true },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Monetization", icon: DollarSign, path: "/monetization" },
    { label: "API Access", icon: Code, path: "/api-access", pro: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <LayoutDashboard className="w-4 h-4" />
                Creator Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Welcome back, <span className="text-primary">Creator</span>
              </h1>
            </div>
            <Link to="/go-live">
              <Button variant="default" size="lg" className="glow gap-2">
                <Video className="w-5 h-5" />
                Go Live Now
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subscription Benefits */}
            <Card className={`p-6 border-border ${currentTier.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Your Plan</h2>
                <Badge className={`gap-1 ${tier === "pro" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" : tier === "creator" ? "bg-gradient-to-r from-primary to-purple-500 text-white border-0" : ""}`}>
                  <currentTier.icon className="h-3 w-3" />
                  {currentTier.name}
                </Badge>
              </div>
              
              {subscriptionEnd && (
                <p className="text-sm text-muted-foreground mb-4">
                  Renews on {new Date(subscriptionEnd).toLocaleDateString()}
                </p>
              )}

              <div className="space-y-2 mb-6">
                {currentTier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              {tier !== "pro" && (
                <Link to="/pricing">
                  <Button variant="default" className="w-full gap-2">
                    <Crown className="h-4 w-4" />
                    {tier === "creator" ? "Upgrade to Pro" : "Upgrade Plan"}
                  </Button>
                </Link>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.path}>
                    <Button 
                      variant={action.primary ? "default" : "outline"} 
                      className={`w-full h-auto py-4 flex-col gap-2 relative ${action.pro && !hasAccess("api_access") ? "border-amber-500/50" : ""}`}
                    >
                      {action.pro && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] px-1.5 py-0.5">
                          <Crown className="w-2.5 h-2.5 mr-0.5" />
                          Pro
                        </Badge>
                      )}
                      <action.icon className="w-5 h-5" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Streams */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Recent Streams</h2>
                <Link to="/analytics" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentStreams.map((stream, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">
                        {stream.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {stream.views.toLocaleString()}
                        </span>
                        <span>{stream.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Earnings Overview */}
          <Card className="p-6 bg-card border-border mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Earnings Overview</h2>
              <Link to="/monetization" className="text-sm text-primary hover:underline">
                View details
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">$180.50</div>
                <div className="text-sm text-muted-foreground">Virtual Gifts</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">$45.00</div>
                <div className="text-sm text-muted-foreground">Subscriptions</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">$19.50</div>
                <div className="text-sm text-muted-foreground">Ad Revenue</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/10">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">$245.00</div>
                <div className="text-sm text-muted-foreground">Total This Month</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
