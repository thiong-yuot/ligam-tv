import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Copy,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAffiliate } from "@/hooks/useAffiliate";
import { useToast } from "@/hooks/use-toast";

const Affiliates = () => {
  const { user } = useAuth();
  const { affiliate, isLoading, joinProgram } = useAffiliate();
  const { toast } = useToast();

  const handleCopyLink = () => {
    if (affiliate?.referral_code) {
      const link = `${window.location.origin}/signup?ref=${affiliate.referral_code}`;
      navigator.clipboard.writeText(link);
      toast({ title: "Link copied!" });
    }
  };

  const handleJoinProgram = async () => {
    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    await joinProgram();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Affiliate Program
            </h1>
            <p className="text-muted-foreground">
              Earn <span className="text-primary font-semibold">25%</span> for the first 2 months, then <span className="text-primary font-semibold">15%</span> ongoing — on every sale your referrals make.
            </p>
          </div>

          {/* Join or Link */}
          {user && affiliate ? (
            <Card className="p-5 bg-card border-border mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your referral link</p>
              <div className="flex gap-2">
                <Input 
                  value={`${window.location.origin}/signup?ref=${affiliate.referral_code}`}
                  readOnly
                  className="bg-secondary"
                />
                <Button onClick={handleCopyLink} size="icon" variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-5 bg-card border-border mb-6 flex items-center justify-between">
              <p className="text-sm text-foreground">Join and get your unique referral link instantly.</p>
              {user ? (
                <Button onClick={handleJoinProgram} disabled={isLoading} className="gap-2">
                  {isLoading ? "Joining..." : "Apply Now"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Link to="/auth">
                  <Button className="gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </Card>
          )}

          {/* Stats (only if affiliate) */}
          {user && affiliate && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-card border-border text-center">
                <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">{affiliate.total_referrals || 0}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">${(affiliate.total_earnings || 0).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Earned</p>
              </Card>
              <Card className="p-4 bg-card border-border text-center">
                <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">${(affiliate.pending_earnings || 0).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </Card>
            </div>
          )}

          {/* How it works */}
          <Card className="p-5 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">How it works</h2>
            <div className="space-y-3">
              {[
                { step: "1", text: "Sign up and get your unique referral link." },
                { step: "2", text: "Share it anywhere — bio, videos, newsletters." },
                { step: "3", text: "Earn on every purchase your referrals make." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </span>
                  <p className="text-sm text-muted-foreground pt-1">{item.text}</p>
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

export default Affiliates;
