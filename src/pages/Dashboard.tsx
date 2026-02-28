import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEarningsSummary } from "@/hooks/useEarnings";
import { useStreams } from "@/hooks/useStreams";
import {
  Video, DollarSign, Eye, Clock, Play, Loader2, BarChart3, User,
  ClipboardList, Link2,
} from "lucide-react";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardOrders from "@/components/dashboard/DashboardOrders";

const Dashboard = () => {
  const [checking, setChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultTab = searchParams.get("tab") || "overview";

  const { totalThisMonth } = useEarningsSummary();
  const { data: allStreams = [] } = useStreams();
  const userStreams = allStreams.filter(s => s.user_id === userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login?redirect=%2Fdashboard"); return; }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">

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

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Streams", value: userStreams.length.toLocaleString(), icon: Video },
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
              { label: "Payment Links", icon: Link2, path: "/payment-links" },
            ].map((action) => (
              <Link key={action.label} to={action.path} className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Tabs: Streams + Orders */}
          <Tabs defaultValue={defaultTab} className="space-y-4">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview" className="gap-1.5">
                <Video className="w-3.5 h-3.5" />
                Streams
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5">
                <ClipboardList className="w-3.5 h-3.5" />
                Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DashboardOverview userStreams={userStreams} />
            </TabsContent>

            <TabsContent value="orders">
              <DashboardOrders />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
