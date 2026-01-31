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
      title: "Built for All",
      description: "Streamers, viewers, teachers, sellers, freelancers—everyone belongs here with tools that work for them.",
    },
    {
      icon: Shield,
      title: "Fair & Transparent",
      description: "Keep 85-92% of earnings. Weekly payouts. No hidden fees, no surprise cuts.",
    },
    {
      icon: Zap,
      title: "Productivity First",
      description: "Eelai AI, news, weather, and tools that help everyone—whether you create or consume.",
    },
    {
      icon: Heart,
      title: "Your Platform, Your Way",
      description: "Stream, sell, teach, watch, or hire. One account, endless possibilities.",
    },
  ];

  const timeline = [
    { year: "2026", title: "Foundation", description: "Streaming, marketplace, and services launch as one integrated platform" },
    { year: "2026", title: "Monetization Layer", description: "Tips, subscriptions, and affiliate tools go live for creators" },
    { year: "2026", title: "Education Hub", description: "Courses and 1-on-1 bookings open new paths to income" },
    { year: "2027", title: "Global Reach", description: "Multi-currency payouts and localized experiences expand worldwide" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Built for All
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            A Platform for <span className="text-primary">Everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ligam.tv is built for all—streamers, teachers, sellers, freelancers, and viewers alike. 
            Whether you create or consume, teach or learn, sell or shop—everyone has a place here 
            to create, discover, and thrive together.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-card/30 border-y border-border">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                One Platform, <span className="text-primary">Endless Possibilities</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We believe everyone deserves a platform that works for them—not just streamers chasing 
                live audiences. Ligam.tv is where creators, viewers, and learners thrive together.
              </p>
              <p className="text-muted-foreground">
                Stream if you want. Watch if you prefer. Sell products, teach courses, or offer services. 
                With Eelai AI, a built-in shop, and productivity tools, everyone has what they need to 
                create, discover, and grow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Video, label: "Stream & Watch" },
                { icon: Users, label: "Teach & Learn" },
                { icon: Zap, label: "Sell & Shop" },
                { icon: Award, label: "Hire & Offer" },
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
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-card/30 border-y border-border">
        <div className="w-full max-w-[1920px] mx-auto">
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
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Your Place to Thrive
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Whether you stream, teach, sell, watch, or learn—Ligam.tv is built for you. 
            Join a platform that welcomes everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="default" size="lg" className="glow">
                Get Started Free
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="lg">
                Explore Platform
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
