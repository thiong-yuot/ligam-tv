import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Star, 
  DollarSign, 
  Briefcase, 
  Filter, 
  Loader2, 
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useFreelancers } from "@/hooks/useFreelancers";
import FreelancerPostForm from "@/components/FreelancerPostForm";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

const Freelance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: freelancers = [], isLoading } = useFreelancers();

  const categories = [
    "All",
    "Video Editing",
    "Graphic Design",
    "Music Production",
    "Voice Over",
    "Animation",
    "3D Modeling",
    "Consulting",
    "Streaming Setup",
  ];

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesCategory = activeCategory === "All" || (f.skills && f.skills.some(skill => 
      skill.toLowerCase().includes(activeCategory.toLowerCase())
    ));
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { icon: Users, label: "Active Freelancers", value: freelancers.length.toString() },
    { icon: Zap, label: "Quick Response", value: "< 24h" },
    { icon: TrendingUp, label: "Projects Completed", value: "1,200+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Modern Gradient Design */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Ligam Marketplace
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Creative Partner
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with talented freelancers who specialize in streaming, content creation, and digital media. Elevate your content today.
            </p>

            {/* Search Bar with Enhanced Design */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by skill, name, or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 h-14 text-lg bg-transparent border-0 focus-visible:ring-0"
                />
                <Button className="absolute right-2 rounded-lg">
                  Search
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Pill Design */}
      <section className="py-4 px-4 sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-y border-border">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 rounded-full ${
                  activeCategory === category 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "hover:bg-muted"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Freelancers Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Available Talent
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredFreelancers.length} freelancers ready to work
              </p>
            </div>
            <FreelancerPostForm />
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton variant="avatar" className="w-14 h-14 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" className="w-3/4" />
                      <Skeleton variant="text" className="w-1/2 h-3" />
                    </div>
                  </div>
                  <Skeleton variant="text" className="w-full h-12 mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton variant="text" className="w-16 h-6 rounded-full" />
                    <Skeleton variant="text" className="w-20 h-6 rounded-full" />
                  </div>
                  <Skeleton variant="text" className="w-full h-10" />
                </div>
              ))}
            </div>
          ) : filteredFreelancers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFreelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={freelancer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.name}`}
                        alt={freelancer.name}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
                      />
                      {freelancer.is_available && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                      )}
                      {freelancer.is_verified && (
                        <div className="absolute -top-1 -right-1">
                          <CheckCircle className="w-4 h-4 text-primary fill-primary/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {freelancer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {freelancer.title}
                      </p>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  {freelancer.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {freelancer.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-foreground">
                        {freelancer.rating?.toFixed(1) || "New"}
                      </span>
                      <span className="text-muted-foreground">
                        ({freelancer.total_jobs || 0})
                      </span>
                    </div>
                    {freelancer.hourly_rate && (
                      <div className="flex items-center gap-1 text-primary font-medium">
                        <DollarSign className="w-4 h-4" />
                        {freelancer.hourly_rate}/hr
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {freelancer.skills && freelancer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {freelancer.skills.slice(0, 3).map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary" 
                          className="text-xs bg-muted/50 hover:bg-muted"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-muted/50">
                          +{freelancer.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="default" size="sm" className="flex-1 gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </Button>
                    {freelancer.portfolio_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1.5"
                        onClick={() => window.open(freelancer.portfolio_url!, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No freelancers found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {freelancers.length === 0 
                  ? "Be the first to join our marketplace and showcase your talents!"
                  : "Try adjusting your search or category filter"
                }
              </p>
              {freelancers.length === 0 && <FreelancerPostForm />}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-card/50 backdrop-blur-sm border border-border">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Showcase Your Skills?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join our growing community of creative professionals. Set your own rates, choose your projects, and grow your career.
            </p>
            <FreelancerPostForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Freelance;
