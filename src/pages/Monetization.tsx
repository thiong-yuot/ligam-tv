import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  DollarSign, 
  Gift, 
  Users, 
  TrendingUp, 
  Wallet,
  Loader2,
  Share2,
  ShoppingBag,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import IdentityVerificationCard from "@/components/monetization/IdentityVerificationCard";
import WithdrawalDialog from "@/components/monetization/WithdrawalDialog";
import { useEarningsSummary } from "@/hooks/useEarnings";
import { useIdentityVerification } from "@/hooks/useIdentityVerification";

const Monetization = () => {
  const [checking, setChecking] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const navigate = useNavigate();
  
  const earnings = useEarningsSummary();
  const { isVerified } = useIdentityVerification();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
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

  const availableBalance = earnings.totalThisMonth;

  const revenueItems = [
    { icon: Gift, name: "Tips & Gifts", amount: earnings.giftEarnings },
    { icon: Users, name: "Subscriptions", amount: earnings.subEarnings },
    { icon: TrendingUp, name: "Ad Revenue", amount: earnings.adEarnings },
    { icon: ShoppingBag, name: "Store Sales", amount: earnings.storeEarnings },
    { icon: Briefcase, name: "Services", amount: earnings.serviceEarnings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-display font-bold text-foreground">Monetization</h1>
            </div>
            <Link to="/affiliates">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Affiliates
              </Button>
            </Link>
          </div>

          {/* Identity Verification */}
          {!isVerified && (
            <div className="mb-6">
              <IdentityVerificationCard />
            </div>
          )}

          {/* Balance */}
          <Card className="p-6 bg-card border-border mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <div className="text-3xl font-display font-bold text-foreground">
                  ${availableBalance.toFixed(2)}
                </div>
              </div>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setWithdrawOpen(true)}
                disabled={!isVerified || availableBalance < 50}
              >
                <Wallet className="w-5 h-5" />
                Withdraw
              </Button>
            </div>
            {!isVerified && (
              <p className="text-xs text-muted-foreground mt-3">
                Verify your identity to enable withdrawals.
              </p>
            )}
            {isVerified && availableBalance < 50 && (
              <p className="text-xs text-muted-foreground mt-3">
                Minimum withdrawal: $50
              </p>
            )}
          </Card>

          {/* Revenue Breakdown */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">This Month</h2>
            <div className="space-y-3">
              {revenueItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">${item.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Total Net</span>
                </div>
                <span className="text-sm font-bold text-primary">${availableBalance.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <WithdrawalDialog 
        open={withdrawOpen} 
        onOpenChange={setWithdrawOpen}
        availableBalance={availableBalance}
      />

      <Footer />
    </div>
  );
};

export default Monetization;
