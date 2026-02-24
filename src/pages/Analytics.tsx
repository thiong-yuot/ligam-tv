import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Users,
  Heart,
  DollarSign,
  Loader2,
  Video,
  ArrowLeft,
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
    { label: "Views", value: stream?.total_views?.toLocaleString() || "0", icon: Eye },
    { label: "Peak", value: stream?.peak_viewers?.toLocaleString() || "0", icon: Users },
    { label: "Followers", value: followerCount.toString(), icon: Heart },
    { label: "Earnings", value: `$${totalThisMonth.toFixed(0)}`, icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
            </div>
            <div className="flex gap-1">
              {["24h", "7d", "30d"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-3 text-center">
                <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-base font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Earnings Breakdown */}
          <div className="rounded-lg border border-border p-4 space-y-3">
            <h2 className="text-sm font-medium text-foreground">Earnings Breakdown</h2>
            {[
              { label: "Gifts", amount: giftEarnings },
              { label: "Subscriptions", amount: subEarnings },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">${item.amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Total</span>
              <span className="font-semibold text-primary">${totalThisMonth.toFixed(2)}</span>
            </div>
          </div>

          {/* Stream Info */}
          {stream && (
            <div className="rounded-lg border border-border p-4 space-y-3">
              <h2 className="text-sm font-medium text-foreground">Current Stream</h2>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="font-medium text-foreground truncate">{stream.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={`font-medium ${stream.is_live ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {stream.is_live ? 'Live' : 'Offline'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Viewers</p>
                  <p className="font-medium text-foreground">{stream.viewer_count || 0}</p>
                </div>
              </div>
            </div>
          )}

          {!stream && (
            <div className="rounded-lg border border-border p-8 text-center">
              <Video className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-4">No stream yet — start streaming to track analytics</p>
              <Button size="sm" onClick={() => navigate("/go-live")}>Go Live</Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;
