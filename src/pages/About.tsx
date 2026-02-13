import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Shield, Zap, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const values = [
  { icon: Users, title: "Built for All", description: "Streamers, viewers, teachers, sellers, freelancers—everyone belongs here." },
  { icon: Shield, title: "Fair & Transparent", description: "Keep 85-92% of earnings. No hidden fees." },
  { icon: Zap, title: "One Platform", description: "Stream, sell, teach, or hire—all in one place." },
  { icon: Heart, title: "Your Way", description: "Use what you need. No lock-in, no pressure." },
];

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">About</h1>
          <p className="text-muted-foreground mb-12">
            Ligam.tv is a platform for creators and viewers. Stream, teach, sell, or discover—your way.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {values.map((v) => (
              <div key={v.title} className="p-5 rounded-xl bg-card border border-border">
                <v.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to={user ? "/dashboard" : "/signup"}>
              <Button>{user ? "Go to Dashboard" : "Get Started"}</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
