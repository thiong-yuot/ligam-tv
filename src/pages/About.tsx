import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Users, Shield, Zap, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const values = [
  { icon: Users, title: "Built for All", desc: "Streamers, viewers, teachers, sellers, freelancers — everyone belongs." },
  { icon: Shield, title: "Fair & Transparent", desc: "Free platform. We only earn when you do." },
  { icon: Zap, title: "One Platform", desc: "Stream, sell, teach, or hire — all in one place." },
  { icon: Heart, title: "Your Way", desc: "Use what you need. No lock-in, no pressure." },
];

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">About</h1>
          <p className="text-xs text-muted-foreground mb-6">Ligam.tv is a platform for creators and viewers. Stream, teach, sell, or discover — your way.</p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {values.map((v) => (
              <div key={v.title} className="p-3 rounded-lg bg-card border border-border">
                <v.icon className="w-3.5 h-3.5 text-primary mb-1.5" />
                <p className="text-xs font-medium text-foreground">{v.title}</p>
                <p className="text-[10px] text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-border">
            <Link to={user ? "/dashboard" : "/auth"} className="text-xs text-primary hover:underline font-medium">
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
