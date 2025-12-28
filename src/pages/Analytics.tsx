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
  Calendar,
  Loader2
} from "lucide-react";

const Analytics = () => {
  const [checking, setChecking] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
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
    { label: "Total Views", value: "12,450", change: 12, icon: Eye },
    { label: "Avg Watch Time", value: "24m", change: -5, icon: Clock },
    { label: "New Followers", value: "+234", change: 18, icon: Users },
    { label: "Chat Messages", value: "3,892", change: 8, icon: MessageSquare },
  ];

  const topStreams = [
    { title: "Epic Gaming Night", views: 4250, duration: "4h 30m", engagement: "85%" },
    { title: "Music Production Live", views: 2890, duration: "3h 15m", engagement: "78%" },
    { title: "Q&A Session", views: 2100, duration: "2h 00m", engagement: "92%" },
    { title: "Art Stream", views: 1680, duration: "2h 45m", engagement: "71%" },
    { title: "Just Chatting", views: 1530, duration: "1h 30m", engagement: "88%" },
  ];

  const demographics = [
    { label: "18-24", percentage: 35 },
    { label: "25-34", percentage: 42 },
    { label: "35-44", percentage: 15 },
    { label: "45+", percentage: 8 },
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
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.change >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(stat.change)}%
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
              <div className="aspect-[2/1] rounded-xl bg-secondary/50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Chart visualization</p>
                </div>
              </div>
            </Card>

            {/* Demographics */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Audience Age</h2>
              <div className="space-y-4">
                {demographics.map((demo, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">{demo.label}</span>
                      <span className="text-muted-foreground">{demo.percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${demo.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Top Streams */}
          <Card className="p-6 bg-card border-border mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Top Performing Streams</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stream</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Views</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {topStreams.map((stream, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{stream.title}</span>
                        </div>
                      </td>
                      <td className="text-right py-4 px-4 text-foreground">
                        {stream.views.toLocaleString()}
                      </td>
                      <td className="text-right py-4 px-4 text-muted-foreground">
                        {stream.duration}
                      </td>
                      <td className="text-right py-4 px-4">
                        <span className="text-primary bg-primary/10 px-2 py-1 rounded-full text-sm">
                          {stream.engagement}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;
