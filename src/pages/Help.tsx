import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  HelpCircle, 
  Search,
  Video,
  DollarSign,
  Shield,
  Settings,
  Users,
  MessageSquare,
  ArrowRight
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Video,
      title: "Getting Started",
      description: "Learn the basics of streaming on Ligam",
      articles: 12,
      path: "/help/getting-started",
    },
    {
      icon: DollarSign,
      title: "Monetization",
      description: "Earning money from your streams",
      articles: 8,
      path: "/help/monetization",
    },
    {
      icon: Shield,
      title: "Account & Security",
      description: "Manage your account settings",
      articles: 15,
      path: "/help/account",
    },
    {
      icon: Settings,
      title: "Technical Support",
      description: "Troubleshooting and setup guides",
      articles: 20,
      path: "/help/technical",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building and managing your audience",
      articles: 10,
      path: "/help/community",
    },
    {
      icon: MessageSquare,
      title: "Chat & Moderation",
      description: "Managing your stream chat",
      articles: 7,
      path: "/help/moderation",
    },
  ];

  const popularArticles = [
    "How to set up your first stream",
    "Connecting OBS to Ligam.tv",
    "Understanding your analytics",
    "Setting up channel subscriptions",
    "Enabling two-factor authentication",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            How Can We <span className="text-primary">Help</span>?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Search our knowledge base or browse categories below
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">
            Browse by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <span className="text-sm text-primary">{category.articles} articles</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">
            Popular Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {article}
                </span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Still Need Help?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="default" size="lg" className="gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" size="lg">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Help;
