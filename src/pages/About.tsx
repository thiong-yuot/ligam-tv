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
      title: "Access Over Gatekeeping",
      description: "Knowledge and opportunity should reach everyone. We build tools that remove barriers, not create them.",
    },
    {
      icon: Shield,
      title: "Honest Infrastructure",
      description: "Clear pricing, real uptime stats, and fees that make sense. No hidden terms, no surprise cuts.",
    },
    {
      icon: Zap,
      title: "Speed to Independence",
      description: "Every feature we ship is designed to help you earn faster and depend on platforms less.",
    },
    {
      icon: Heart,
      title: "Creator Ownership",
      description: "Your audience, your content, your earnings. We handle the pipes — you own the rest.",
    },
  ];

  const timeline = [
    { year: "2024", title: "Foundation", description: "Streaming, marketplace, and services launch as one integrated platform" },
    { year: "2024", title: "Monetization Layer", description: "Tips, subscriptions, and affiliate tools go live for creators" },
    { year: "2025", title: "Education Hub", description: "Courses and 1-on-1 bookings open new paths to income" },
    { year: "2026", title: "Global Reach", description: "Multi-currency payouts and localized experiences expand worldwide" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Why Ligam Exists
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Built to Solve <span className="text-primary">Real Problems</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            The world has talent everywhere but opportunity is still concentrated in a few places. 
            Ligam connects creators, professionals, and learners globally — giving anyone with skills 
            a direct path to income and impact.
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
                Decentralize <span className="text-primary">Professional Opportunity</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Traditional platforms take too much and give too little. They sit between you and your 
                audience, extracting value while limiting what you can build.
              </p>
              <p className="text-muted-foreground">
                Ligam is different by design. Stream to millions, sell directly to fans, teach what you know, 
                or offer your expertise as a service. One account, one dashboard, one place to build your livelihood.
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
              Principles That Guide Us
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These shape every product decision, pricing choice, and support conversation
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
              Building in Public
            </h2>
            <p className="text-muted-foreground text-lg">
              Key milestones on the path to a more open creator economy
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
            Join the Movement
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Whether you are ready to go live, launch a course, or find your next gig — 
            start building on Ligam today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-profile">
              <Button variant="default" size="lg" className="glow">
                Create Your Profile
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">
                See What's Live
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
