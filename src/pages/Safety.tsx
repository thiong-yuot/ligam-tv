import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Eye, UserX, Flag, CheckCircle2 } from "lucide-react";

const Safety = () => {
  const features = [
    { icon: Lock, title: "Two-Factor Authentication", desc: "Extra layer of account security" },
    { icon: Eye, title: "Privacy Controls", desc: "Control who sees your content" },
    { icon: UserX, title: "Block & Mute", desc: "Block or mute disruptive users" },
    { icon: Flag, title: "Report System", desc: "Report harmful content for review" },
  ];

  const tips = [
    "Never share your password or stream key",
    "Enable two-factor authentication",
    "Be cautious about links in chat",
    "Use unique, strong passwords",
    "Review privacy settings regularly",
    "Report suspicious activity immediately",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Safety Center</h1>
          <p className="text-xs text-muted-foreground mb-6">Tools and tips to keep you safe on Ligam.tv</p>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Safety Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {features.map((f) => (
                <div key={f.title} className="p-3 rounded-lg bg-card border border-border">
                  <f.icon className="w-3.5 h-3.5 text-primary mb-1.5" />
                  <p className="text-xs font-medium text-foreground">{f.title}</p>
                  <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Safety Tips</h2>
            <div className="space-y-1.5">
              {tips.map((tip) => (
                <div key={tip} className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </section>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Need to report an issue?</p>
            <Link to="/contact" className="text-xs text-primary hover:underline font-medium">Contact Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Safety;
