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
      description: "We believe in putting creators and viewers at the heart of everything we do. Our platform is built to foster genuine connections.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your safety is our priority. We maintain strict community guidelines and provide tools to ensure a positive experience for everyone.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We're constantly pushing boundaries to deliver cutting-edge streaming technology and features that empower creators.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about live content and helping creators turn their passions into thriving communities and careers.",
    },
  ];

  const timeline = [
    { year: "2024", title: "Platform Launch", description: "Ligam.tv launches with core streaming features" },
    { year: "2024", title: "Monetization", description: "Virtual gifts and subscriptions go live" },
    { year: "2024", title: "Freelance Marketplace", description: "Connect with talented creators for collaborations" },
    { year: "Future", title: "Global Expansion", description: "Bringing Ligam to creators worldwide" },
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
            Building the Future of <span className="text-primary">Live Streaming</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ligam.tv is a next-generation live streaming platform designed to help creators 
            build meaningful communities, monetize their content, and connect with audiences worldwide.
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
                Empowering Creators to <span className="text-primary">Thrive</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We're on a mission to democratize live streaming by providing creators with 
                powerful tools, fair monetization, and a supportive community platform.
              </p>
              <p className="text-muted-foreground">
                Whether you're a gamer, musician, artist, or educator, Ligam gives you 
                everything you need to share your passion with the world and build a 
                sustainable creative career.
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
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide everything we do at Ligam
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
            Join the Ligam Community
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Whether you're a creator looking to grow your audience or a viewer seeking 
            amazing content, Ligam is the place for you.
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
