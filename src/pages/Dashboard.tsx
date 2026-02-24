import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MyContentManager from "@/components/dashboard/MyContentManager";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEarningsSummary } from "@/hooks/useEarnings";
import { useStreams } from "@/hooks/useStreams";
import {
  Video,
  DollarSign,
  Eye,
  Clock,
  Play,
  Loader2,
  BarChart3,
  User,
} from "lucide-react";

const Dashboard = () => {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const { totalThisMonth } = useEarningsSummary();
  const { data: allStreams = [] } = useStreams();
  const userStreams = allStreams.filter(s => s.user_id === userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);
      const { data: profileData } = await supabase
        .from("profiles").select("display_name").eq("user_id", session.user.id).maybeSingle();
      setDisplayName(profileData?.display_name || "Creator");
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalViews = userStreams.reduce((sum, s) => sum + (s.total_views || 0), 0);
  const watchTimeHours = Math.floor(userStreams.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 3600);
  const totalStreams = userStreams.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-3xl space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-foreground">
                Hi, {displayName}
              </h1>
              <Link to="/create-profile">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2">
                  <User className="w-3 h-3" />
                  Profile
                </Button>
              </Link>
            </div>
            <Link to="/go-live">
              <Button size="sm" className="gap-1.5">
                <Play className="w-3.5 h-3.5" />
                Go Live
              </Button>
            </Link>
          </div>

          {/* Activity Stats — stream/earnings focused, no social stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Streams", value: totalStreams.toLocaleString(), icon: Video },
              { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
              { label: "Watch Time", value: `${watchTimeHours}h`, icon: Clock },
              { label: "Earnings", value: `$${totalThisMonth.toFixed(0)}`, icon: DollarSign },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-3 text-center">
                <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-base font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="flex gap-2">
            {[
              { label: "Analytics", icon: BarChart3, path: "/analytics" },
              { label: "Monetization", icon: DollarSign, path: "/monetization" },
            ].map((action) => (
              <Link key={action.label} to={action.path} className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Recent Streams */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Recent Streams</p>
              <Link to="/analytics" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {userStreams.length === 0 ? (
              <div className="text-center py-6 rounded-lg border border-border">
                <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No streams yet</p>
                <Link to="/go-live">
                  <Button variant="outline" size="sm" className="mt-2">Start Streaming</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1.5">
                {userStreams.slice(0, 3).map((stream) => (
                  <div key={stream.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <Video className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{stream.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{(stream.total_views || 0).toLocaleString()}</span>
                        <span>{stream.created_at ? new Date(stream.created_at).toLocaleDateString() : ""}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Manager */}
          <MyContentManager />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;