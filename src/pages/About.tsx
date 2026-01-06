import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Video, 
  Shield, 
  Zap, 
  Heart,
  Globe,
  Award,
  Target
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Creators and viewers shape everything we build. The platform exists to serve you — not the other way around.",
    },
    {
      icon: Shield,
      title: "Safety Without Compromise",
      description: "Strict moderation tools, real-time reporting, and proactive enforcement keep the community welcoming.",
    },
    {
      icon: Zap,
      title: "Relentless Improvement",
      description: "We ship updates weekly. If something slows you down, it goes on the roadmap.",
    },
    {
      icon: Heart,
      title: "Creators Win, We Win",
      description: "Low fees, honest payouts, and features that help you earn more — because your success funds ours.",
    },
  ];

  const timeline = [
    { year: "2024", title: "Public Launch", description: "Streaming, shop, and freelance marketplace go live" },
    { year: "2024", title: "Monetization Suite", description: "Virtual gifts, subscriptions, and affiliate program roll out" },
    { year: "2024", title: "Skills Academy", description: "Courses and 1-on-1 bookings open to all creators" },
    { year: "2025", title: "Global Expansion", description: "Multi-language support and regional payment methods" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            About Ligam
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            One Home for <span className="text-primary">Everything You Create</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ligam brings live streaming, ecommerce, courses, and freelance services under one roof — 
            so you can focus on making things, not managing tools.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Built <span className="text-primary">By Creators, For Creators</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We started Ligam because we were tired of platforms that nickel-and-dime creators 
                or bury great content behind confusing algorithms.
              </p>
              <p className="text-muted-foreground">
                Whether you stream gaming sessions, sell handmade goods, teach design, or offer freelance editing — 
                Ligam gives you tools that actually work and fees that leave more money in your pocket.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Video, label: "Live Streaming" },
                { icon: Users, label: "Community" },
                { icon: Zap, label: "Monetization" },
                { icon: Award, label: "Recognition" },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles behind every feature, policy, and support ticket
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground text-lg">
              The milestones that define Ligam
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {item.year}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-px h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            See What's Happening
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Ready to explore? Start streaming in minutes or browse what other creators are building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-profile">
              <Button variant="default" size="lg" className="glow">
                Start Streaming
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">
                Explore Content
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
