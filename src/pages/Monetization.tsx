import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Gift, 
  Users, 
  TrendingUp, 
  CreditCard,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";

const Monetization = () => {
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

  const earningStreams = [
    { 
      icon: Gift, 
      name: "Virtual Gifts", 
      amount: "$180.50", 
      change: "+25%",
      description: "Earn when viewers send gifts during streams"
    },
    { 
      icon: Users, 
      name: "Subscriptions", 
      amount: "$45.00", 
      change: "+12%",
      description: "Monthly recurring revenue from subscribers"
    },
    { 
      icon: TrendingUp, 
      name: "Ad Revenue", 
      amount: "$19.50", 
      change: "+8%",
      description: "Earnings from ads shown on your streams"
    },
  ];

  const payoutHistory = [
    { date: "Dec 15, 2024", amount: "$320.00", status: "Completed" },
    { date: "Nov 15, 2024", amount: "$285.50", status: "Completed" },
    { date: "Oct 15, 2024", amount: "$198.25", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Monetization
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Earn From Your <span className="text-primary">Streams</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your earnings and manage payouts
            </p>
          </div>

          {/* Balance Card */}
          <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-muted-foreground mb-2">Available Balance</p>
                <div className="text-5xl font-display font-bold text-foreground mb-4">
                  $245.00
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm font-medium">+23% from last month</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="default" size="lg" className="gap-2">
                  <Wallet className="w-5 h-5" />
                  Withdraw
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Settings
                </Button>
              </div>
            </div>
          </Card>

          {/* Payout Progress */}
          <Card className="p-6 bg-card border-border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Next Payout</h2>
              <span className="text-sm text-muted-foreground">Jan 15, 2025</span>
            </div>
            <Progress value={75} className="h-3 mb-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">$75 minimum threshold</span>
              <span className="text-primary font-medium">$245 / $75</span>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Earning Streams */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Revenue Streams</h2>
              <div className="space-y-4">
                {earningStreams.map((stream, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stream.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-foreground">{stream.name}</h3>
                        <span className="text-lg font-bold text-foreground">{stream.amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{stream.description}</p>
                        <span className="text-sm text-primary">{stream.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payout History */}
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Payout History</h2>
              <div className="space-y-4">
                {payoutHistory.map((payout, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{payout.amount}</p>
                        <p className="text-sm text-muted-foreground">{payout.date}</p>
                      </div>
                    </div>
                    <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {payout.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Transactions
              </Button>
            </Card>
          </div>

          {/* Requirements */}
          <Card className="p-6 bg-card border-border mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Monetization Requirements</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "100 Followers", completed: true },
                { label: "18+ Years Old", completed: true },
                { label: "10 Hours Streamed", completed: true },
                { label: "Identity Verified", completed: false },
              ].map((req, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border ${req.completed ? 'bg-primary/10 border-primary/30' : 'bg-secondary/50 border-border'}`}
                >
                  <div className="flex items-center gap-2">
                    {req.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={req.completed ? 'text-foreground' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Monetization;
