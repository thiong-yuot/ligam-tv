import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap, Globe, Shield, Gauge, Server, Cloud } from "lucide-react";

const Technology = () => {
  const features = [
    { icon: Zap, title: "Sub-Second Latency", desc: "Real-time chat with no delays" },
    { icon: Globe, title: "Global Edge Network", desc: "Buffer-free playback worldwide" },
    { icon: Shield, title: "Bank-Level Security", desc: "TLS encryption & DDoS protection" },
    { icon: Gauge, title: "Adaptive Quality", desc: "Auto-adjusts for any connection" },
    { icon: Server, title: "Zero Downtime", desc: "Multi-region failover infrastructure" },
    { icon: Cloud, title: "Instant VODs", desc: "Auto-recorded streams & replays" },
  ];

  const stack = [
    { name: "WebRTC", desc: "Real-time comms" },
    { name: "HLS/DASH", desc: "Adaptive streaming" },
    { name: "RTMP", desc: "Pro ingest" },
    { name: "AV1/HEVC", desc: "Next-gen codecs" },
    { name: "Edge CDN", desc: "Distributed delivery" },
    { name: "AI", desc: "Smart optimization" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Technology</h1>
          <p className="text-xs text-muted-foreground mb-6">Streaming infrastructure that just works.</p>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Capabilities</h2>
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
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tech Stack</h2>
            <div className="grid grid-cols-3 gap-2">
              {stack.map((t) => (
                <div key={t.name} className="p-2.5 rounded-lg bg-card border border-border text-center">
                  <p className="text-xs font-medium text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Go live in under 5 minutes. No credit card required.</p>
            <Link to="/auth" className="text-xs text-primary hover:underline font-medium">Get Started Free</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Technology;
