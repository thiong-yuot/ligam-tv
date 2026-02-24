import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, XCircle } from "lucide-react";

const Guidelines = () => {
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
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Community Guidelines</h1>
          <p className="text-xs text-muted-foreground mb-6">Keep Ligam.tv safe and welcoming for everyone.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Allowed</h2>
              <div className="space-y-1.5">
                {allowed.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-foreground">
                    <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prohibited</h2>
              <div className="space-y-1.5">
                {prohibited.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-foreground">
                    <XCircle className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-foreground mb-1.5">Enforcement</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Violations may result in content removal, temporary suspension, or permanent account termination depending on severity. All reports are reviewed by our team.
            </p>
          </section>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Have questions?</p>
            <Link to="/contact" className="text-xs text-primary hover:underline font-medium">Contact Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guidelines;
