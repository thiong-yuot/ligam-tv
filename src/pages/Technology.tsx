import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Cpu, 
  Globe, 
  Shield, 
  Zap, 
  Server, 
  Lock,
  Gauge,
  Cloud,
  Radio,
  MonitorPlay
} from "lucide-react";

const Technology = () => {
  const features = [
    {
      icon: Zap,
      title: "Ultra-Low Latency",
      description: "Sub-second latency streaming powered by our global edge network. Real-time interaction with your audience.",
      stats: "<1s latency",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Content delivered from 200+ edge locations worldwide. Smooth streaming experience regardless of location.",
      stats: "200+ locations",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption for all streams. DDoS protection and secure authentication built-in.",
      stats: "256-bit encryption",
    },
    {
      icon: Gauge,
      title: "Adaptive Bitrate",
      description: "Automatic quality adjustment based on viewer's connection. Crystal clear streams for everyone.",
      stats: "Up to 4K 60fps",
    },
    {
      icon: Server,
      title: "99.99% Uptime",
      description: "Redundant infrastructure ensures your stream never goes down. Multi-region failover.",
      stats: "99.99% SLA",
    },
    {
      icon: Cloud,
      title: "Cloud Recording",
      description: "Automatic VOD creation with instant playback. Store and manage all your content.",
      stats: "Unlimited storage",
    },
  ];

  const techStack = [
    { name: "WebRTC", description: "Real-time communication" },
    { name: "HLS/DASH", description: "Adaptive streaming" },
    { name: "RTMP Ingest", description: "Professional streaming" },
    { name: "AV1/HEVC", description: "Next-gen codecs" },
    { name: "Edge Computing", description: "Distributed processing" },
    { name: "AI Enhancement", description: "Smart optimization" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Cpu className="w-4 h-4" />
            Our Technology
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Built for <span className="text-primary">Performance</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Cutting-edge streaming infrastructure designed to deliver flawless 
            live experiences to millions of viewers worldwide.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {[
              { icon: Radio, label: "Live Streaming" },
              { icon: MonitorPlay, label: "VOD Delivery" },
              { icon: Lock, label: "DRM Protection" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Enterprise-Grade Infrastructure
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every component optimized for the best streaming experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-primary font-mono text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Technology Stack
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by industry-leading technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border text-center hover:border-primary/50 transition-colors"
              >
                <h4 className="text-foreground font-semibold mb-1">{tech.name}</h4>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Global Architecture
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Distributed infrastructure for maximum reliability
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgb3BhY2l0eT0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
              
              <div className="relative z-10 text-center">
                <Globe className="w-20 h-20 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  200+ Edge Locations
                </h3>
                <p className="text-muted-foreground">
                  Content delivered from the nearest point to your viewers
                </p>
              </div>

              {/* Animated dots */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full animate-ping" />
              <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-ping animation-delay-500" />
              <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary rounded-full animate-ping animation-delay-1000" />
              <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-primary rounded-full animate-ping animation-delay-1500" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Start streaming with enterprise-grade infrastructure today.
          </p>
          <Button variant="default" size="xl" className="glow">
            Start Streaming Free
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technology;
