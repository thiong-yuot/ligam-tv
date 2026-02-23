import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useEarningsSummary } from "@/hooks/useEarnings";
import { useStreams } from "@/hooks/useStreams";
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  DollarSign, 
  Eye,
  Clock,
  Gift,
  Play,
  Loader2,
  Crown,
  Sparkles,
  Check,
  X,
  Zap,
  Code,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Briefcase
} from "lucide-react";

const Dashboard = () => {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { tier, subscriptionEnd } = useSubscription();
  const { hasAccess } = useFeatureAccess();
  const { 
    totalThisMonth, 
    giftEarnings, 
    subEarnings, 
    adEarnings, 
    storeEarnings, 
    serviceEarnings,
    platformFees 
  } = useEarningsSummary();
  const { data: allStreams = [] } = useStreams();

  // Get user's streams
  const userStreams = allStreams.filter(s => s.user_id === userId);

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
        { name: "Custom Reactions", included: false },
        { name: "Priority Support", included: false },
        { name: "No Ads for Viewers", included: false },
        { name: "4K Streaming", included: false },
      ],
    },
    creator: {
      name: "Creator",
      icon: Sparkles,
      color: "text-primary",
      bgColor: "bg-gradient-to-r from-primary/20 to-amber-500/20",
      features: [
        { name: "720p Streaming", included: true },
        { name: "Basic Chat", included: true },
        { name: "Community Access", included: true },
        { name: "HD Streaming", included: true },
        { name: "Custom Reactions", included: true },
        { name: "Priority Support", included: true },
        { name: "No Ads for Viewers", included: true },
        { name: "4K Streaming", included: false },
        
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
        { name: "Custom Reactions", included: true },
        { name: "Priority Support", included: true },
        { name: "No Ads for Viewers", included: true },
        { name: "4K Streaming", included: true },
        
      ],
    },
  };

  const currentTier = tierFeatures[tier || "free"];

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      setProfile(profileData);
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

  // Calculate real stats
  const totalViews = userStreams.reduce((sum, s) => sum + (s.total_views || 0), 0);
  const totalWatchTime = userStreams.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const watchTimeHours = Math.floor(totalWatchTime / 3600);
  const followerCount = profile?.follower_count || 0;

  const stats = [
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
    { label: "Followers", value: followerCount.toLocaleString(), icon: Users },
    { label: "Watch Time", value: `${watchTimeHours}h`, icon: Clock },
    { label: "Earnings", value: `$${totalThisMonth.toFixed(2)}`, icon: DollarSign },
  ];

  const quickActions = [
    { label: "Go Live", icon: Play, path: "/go-live", primary: true },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Monetization", icon: DollarSign, path: "/monetization" },
    
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <LayoutDashboard className="w-4 h-4" />
                Creator Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Welcome back, <span className="text-primary">{profile?.display_name || "Creator"}</span>
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
                <Badge className="gap-1">
                  <currentTier.icon className="h-3 w-3" />
                  Free
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

            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.path}>
                    <Button 
                      variant={action.primary ? "default" : "outline"} 
                      className={`w-full h-auto py-4 flex-col gap-2 relative`}
                    >
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
                {userStreams.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">No streams yet</p>
                    <Link to="/go-live">
                      <Button variant="outline" size="sm" className="mt-3">
                        Start Your First Stream
                      </Button>
                    </Link>
                  </div>
                ) : (
                  userStreams.slice(0, 3).map((stream) => (
                    <div 
                      key={stream.id} 
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
                            {(stream.total_views || 0).toLocaleString()}
                          </span>
                          <span>{stream.created_at ? new Date(stream.created_at).toLocaleDateString() : ""}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Gift className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">${giftEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Tips/Gifts</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">${subEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Subscriptions</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">${adEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Ad Revenue</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50 relative">
                <ShoppingBag className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">${storeEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Store Sales</div>
                <span className="absolute top-2 right-2 text-[10px] text-muted-foreground">
                  -{platformFees.store}%
                </span>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50 relative">
                <Briefcase className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">${serviceEarnings.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Service Commissions</div>
                <span className="absolute top-2 right-2 text-[10px] text-muted-foreground">
                  -{platformFees.services}%
                </span>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20">
                <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-xl font-bold text-primary">${totalThisMonth.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total Net</div>
              </div>
            </div>
            
            {/* Platform Fee Info */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Platform fees: {platformFees.store}% on store sales • {platformFees.services}% on service commissions • No fees on tips
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
