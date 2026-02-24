import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Users,
  Clock,
  Loader2,
  Video,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import { useStreams } from "@/hooks/useStreams";
import { useAuth } from "@/hooks/useAuth";

const Analytics = () => {
  const [checking, setChecking] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: allStreams = [], isLoading: streamsLoading } = useStreams();
  const userStreams = allStreams.filter(s => s.user_id === user?.id);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate("/login");
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (checking || streamsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalViews = userStreams.reduce((sum, s) => sum + (s.total_views || 0), 0);
  const peakViewers = userStreams.reduce((max, s) => Math.max(max, s.peak_viewers || 0), 0);
  const watchTimeHours = Math.floor(userStreams.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 3600);
  const liveStream = userStreams.find(s => s.is_live);

  const stats = [
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
    { label: "Peak Viewers", value: peakViewers.toLocaleString(), icon: TrendingUp },
    { label: "Streams", value: userStreams.length.toString(), icon: Video },
    { label: "Watch Time", value: `${watchTimeHours}h`, icon: Clock },
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

          {/* Stream Performance Stats */}
          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-3 text-center">
                <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-base font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Live Now */}
          {liveStream && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h2 className="text-sm font-medium text-foreground">Live Now</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="font-medium text-foreground truncate">{liveStream.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Viewers</p>
                  <p className="font-medium text-foreground">{liveStream.viewer_count || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peak</p>
                  <p className="font-medium text-foreground">{liveStream.peak_viewers || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stream History */}
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Stream History</h2>
            {userStreams.length === 0 ? (
              <div className="rounded-lg border border-border p-8 text-center">
                <Video className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-4">No streams yet — start streaming to track analytics</p>
                <Button size="sm" onClick={() => navigate("/go-live")}>Go Live</Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {userStreams.map((stream) => (
                  <div key={stream.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Video className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{stream.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{(stream.total_views || 0).toLocaleString()}</span>
                        <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{stream.peak_viewers || 0} peak</span>
                        <span>{stream.created_at ? new Date(stream.created_at).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                    {stream.is_live && <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">LIVE</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;