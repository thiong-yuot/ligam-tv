import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

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
    { label: "Settings", icon: Settings, path: "/settings" },
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
            {/* Quick Actions */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.path}>
                    <Button 
                      variant={action.primary ? "default" : "outline"} 
                      className="w-full h-auto py-4 flex-col gap-2"
                    >
                      <action.icon className="w-5 h-5" />
                      <span className="text-sm">{action.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Streams */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
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
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {stream.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {stream.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {stream.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {stream.duration}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
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
