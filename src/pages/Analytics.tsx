import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Clock, 
  Users,
  MessageSquare,
  Heart,
  Loader2,
  Video
} from "lucide-react";
import { useUserStream } from "@/hooks/useStreams";
import { useEarningsSummary } from "@/hooks/useEarnings";
import { useAuth } from "@/hooks/useAuth";

const Analytics = () => {
  const [checking, setChecking] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const { data: stream, isLoading: streamLoading } = useUserStream(user?.id || "");
  const { totalThisMonth, giftEarnings, subEarnings } = useEarningsSummary();
  
  // Get follower count from profile
  const followerCount = profile?.follower_count || 0;

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

  if (checking || streamLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Views", 
      value: stream?.total_views?.toLocaleString() || "0", 
      icon: Eye 
    },
    { 
      label: "Peak Viewers", 
      value: stream?.peak_viewers?.toLocaleString() || "0", 
      icon: Users 
    },
    { 
      label: "Followers", 
      value: followerCount.toString(), 
      icon: Heart 
    },
    { 
      label: "Earnings (This Month)", 
      value: `$${totalThisMonth.toFixed(2)}`, 
      icon: BarChart3 
    },
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
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Stream <span className="text-primary">Analytics</span>
              </h1>
            </div>
            <div className="flex gap-2">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-card border-border">
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
            {/* Chart Placeholder */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <h2 className="text-xl font-semibold text-foreground mb-6">Views Over Time</h2>
              {stream ? (
                <div className="aspect-[2/1] rounded-xl bg-secondary/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Analytics data will populate as you stream</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[2/1] rounded-xl bg-secondary/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Start streaming to see your analytics</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Earnings Breakdown */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Earnings Breakdown</h2>
              <div className="space-y-4">
                {[
                  { label: "Gifts", amount: giftEarnings },
                  { label: "Subscriptions", amount: subEarnings },
                  { label: "Total", amount: totalThisMonth },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-semibold ${index === 2 ? 'text-primary' : 'text-foreground'}`}>
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stream Info */}
          {stream && (
            <Card className="p-6 bg-card border-border mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Current Stream</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Title</p>
                  <p className="font-medium text-foreground">{stream.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className={`font-medium ${stream.is_live ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {stream.is_live ? 'Live' : 'Offline'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Viewers</p>
                  <p className="font-medium text-foreground">{stream.viewer_count || 0}</p>
                </div>
              </div>
            </Card>
          )}

          {!stream && (
            <Card className="p-8 bg-card border-border mt-8 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Stream Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first stream to start tracking your analytics
              </p>
              <Button onClick={() => navigate("/go-live")}>
                Go Live
              </Button>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;
