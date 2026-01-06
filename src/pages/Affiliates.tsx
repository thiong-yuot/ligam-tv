import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Share2,
  Gift,
  CheckCircle2,
  ArrowRight,
  Copy,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAffiliate } from "@/hooks/useAffiliate";
import { useToast } from "@/hooks/use-toast";

const Affiliates = () => {
  const { user } = useAuth();
  const { affiliate, isLoading, joinProgram, referrals, earnings } = useAffiliate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleCopyLink = () => {
    if (affiliate?.referral_code) {
      const link = `${window.location.origin}/signup?ref=${affiliate.referral_code}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Your affiliate link has been copied to clipboard.",
      });
    }
  };

  const handleJoinProgram = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join the affiliate program.",
        variant: "destructive",
      });
      return;
    }
    await joinProgram();
  };

  const steps = [
    {
      number: "1",
      title: "Join the program",
      description: "Apply to become a Ligam affiliate. It's free and takes just a minute."
    },
    {
      number: "2", 
      title: "Promote Ligam to your audience",
      description: "Talk about Ligam on your blog, in your newsletter, or on your social channels."
    },
    {
      number: "3",
      title: "Earn Money",
      description: "Get 25% of our earnings for the first two months, then 15% recurring on all purchases."
    }
  ];

  const audienceTypes = [
    "Content Creators",
    "Influencers", 
    "Bloggers",
    "YouTubers",
    "Course Creators",
    "Community Leaders"
  ];

  const faqs = [
    {
      question: "What is the Ligam Affiliate Program and how can I apply?",
      answer: "The affiliate program is a way for bloggers, writers, creators, influencers, and others to spread the word about Ligam and earn financial rewards. Simply click the 'Join Program' button to get started!"
    },
    {
      question: "How do I earn commission?",
      answer: "You earn 25% of our platform earnings (after we take our commissions) for any purchase made through your affiliate link — including courses, products, freelance services, and subscription tiers. This applies for the first two months after a user signs up, then becomes 15% for all future purchases."
    },
    {
      question: "What purchases qualify for commission?",
      answer: "All purchases qualify! Whether your referral buys a course, a product from the shop, hires a freelancer, or upgrades to a paid subscription tier — you earn commission on our platform earnings from that transaction."
    },
    {
      question: "How can I create, track, and promote my affiliate link?",
      answer: "You can create and track multiple links directly from your affiliate dashboard once you join the program. Once you receive your personalized link, share it where your audience is most active — whether that's your blog, newsletter, YouTube channel, or social platforms."
    },
    {
      question: "What are the commission rates?",
      answer: "You earn 25% of our platform earnings for the first two months of a referral's activity, then 15% for all purchases and recurring payments thereafter. There's no limit to how much you can earn!"
    },
    {
      question: "When do I get paid?",
      answer: "Affiliate earnings are paid out monthly, along with your other Ligam earnings. You must have a verified identity and at least $50 in your balance to request a withdrawal."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Affiliate Program
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
              <span className="text-primary">Refer Ligam</span> to your audience and followers.
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground mb-2">
              <span className="text-primary font-semibold">Earn up to 25%</span> of our earnings on every purchase.
            </p>
            
            <p className="text-lg text-muted-foreground mb-8">
              Courses, products, freelance, subscriptions — <span className="text-primary font-medium">no limit</span> to how much you can earn.
            </p>

            {user && affiliate ? (
              <div className="max-w-md mx-auto">
                <Card className="p-6 bg-card border-border">
                  <p className="text-sm text-muted-foreground mb-3">Your affiliate link:</p>
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
                  <Link to="/monetization" className="block mt-4">
                    <Button variant="default" className="w-full">
                      View Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              </div>
            ) : (
              <Button 
                size="xl" 
                className="glow"
                onClick={handleJoinProgram}
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Apply Now"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Details */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
              Earn More With Every Referral
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8 bg-card border-primary/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">25%</p>
                    <p className="text-muted-foreground">First 2 months</p>
                  </div>
                </div>
                <p className="text-foreground">
                  Earn 25% of our platform earnings on every purchase your referral makes during their first two months.
                </p>
              </Card>
              
              <Card className="p-8 bg-card border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">15%</p>
                    <p className="text-muted-foreground">Recurring forever</p>
                  </div>
                </div>
                <p className="text-foreground">
                  Continue earning 15% of our earnings on every purchase or recurring payment. No time limit!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-8">
            Who can apply?
          </h2>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {audienceTypes.map((type, index) => (
              <div 
                key={index}
                className="px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-foreground font-medium"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate Dashboard Preview (for joined users) */}
      {user && affiliate && (
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-display font-bold text-foreground text-center mb-8">
              Your Affiliate Stats
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="p-6 bg-card border-border text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{affiliate.total_referrals || 0}</p>
                <p className="text-muted-foreground">Total Referrals</p>
              </Card>
              
              <Card className="p-6 bg-card border-border text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">${(affiliate.total_earnings || 0).toFixed(2)}</p>
                <p className="text-muted-foreground">Total Earned</p>
              </Card>
              
              <Card className="p-6 bg-card border-border text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">${(affiliate.pending_earnings || 0).toFixed(2)}</p>
                <p className="text-muted-foreground">Pending Earnings</p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Ready to become a Ligam affiliate?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our affiliate program today and start earning recurring commissions for every creator you refer.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="xl" className="glow">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="xl" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : !affiliate ? (
            <Button 
              size="xl" 
              className="glow"
              onClick={handleJoinProgram}
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Apply Now"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Link to="/monetization">
              <Button size="xl" className="glow">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Affiliates;
