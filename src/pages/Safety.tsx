import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Lock, 
  Eye,
  AlertTriangle,
  UserX,
  Flag,
  Heart,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

const Safety = () => {
  const safetyFeatures = [
    {
      icon: Lock,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account with 2FA.",
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description: "Control who can see your content and interact with you.",
    },
    {
      icon: UserX,
      title: "Block & Mute",
      description: "Easily block or mute users who violate community standards.",
    },
    {
      icon: Flag,
      title: "Report System",
      description: "Report harmful content or behavior for review by our team.",
    },
  ];

  const safetyTips = [
    "Never share your password or stream key with anyone",
    "Enable two-factor authentication on your account",
    "Be cautious about clicking links in chat",
    "Use unique, strong passwords for your account",
    "Review your privacy settings regularly",
    "Report suspicious activity immediately",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Safety Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Your Safety <span className="text-primary">Matters</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about the tools and resources we provide to keep you safe on Ligam.tv
          </p>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-12 text-center">
            Safety Features
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
            Safety Tips
          </h2>
          <Card className="p-8 bg-card border-border">
            <div className="space-y-4">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Report Section */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Report an Issue
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              If you encounter harmful content or behavior, please report it immediately. 
              Our trust & safety team reviews all reports within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="destructive" size="lg" className="gap-2">
                <Flag className="w-5 h-5" />
                Report Content
              </Button>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Safety;
