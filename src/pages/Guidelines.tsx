import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Heart, 
  Shield,
  Ban,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";

const Guidelines = () => {
  const principles = [
    {
      icon: Heart,
      title: "Respect Everyone",
      description: "Treat all community members with respect and dignity.",
    },
    {
      icon: Shield,
      title: "Keep It Safe",
      description: "Help maintain a safe environment for all users.",
    },
    {
      icon: BookOpen,
      title: "Be Authentic",
      description: "Be yourself and encourage genuine interactions.",
    },
  ];

  const allowed = [
    "Creative expression and original content",
    "Respectful discussions and debates",
    "Gaming, music, art, and educational streams",
    "Constructive feedback and criticism",
    "Self-promotion within reasonable limits",
  ];

  const prohibited = [
    "Harassment, bullying, or hate speech",
    "Sexually explicit or pornographic content",
    "Violence, threats, or dangerous activities",
    "Spam, scams, or misleading content",
    "Copyright infringement",
    "Impersonation or identity fraud",
    "Illegal activities or substances",
    "Sharing personal information without consent",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Community Guidelines
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Community <span className="text-primary">Guidelines</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our community guidelines help keep Ligam.tv a safe and welcoming space for everyone.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-12">
            Our Core Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Allowed & Prohibited */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Allowed */}
            <Card className="p-8 bg-card border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  What's Allowed
                </h3>
              </div>
              <ul className="space-y-3">
                {allowed.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Prohibited */}
            <Card className="p-8 bg-card border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  What's Prohibited
                </h3>
              </div>
              <ul className="space-y-3">
                {prohibited.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Enforcement */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Ban className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Enforcement
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Violations of these guidelines may result in content removal, temporary suspension, 
            or permanent account termination depending on severity and frequency.
          </p>
          <p className="text-muted-foreground">
            We review all reports and take action to maintain a positive community experience.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Guidelines;
