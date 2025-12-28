import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Clock, DollarSign, Briefcase, Filter } from "lucide-react";

const Freelance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Video Editing",
    "Graphic Design",
    "Music Production",
    "Voice Over",
    "Animation",
    "3D Modeling",
    "Consulting",
  ];

  const freelancers = [
    {
      id: 1,
      name: "Alex Rivera",
      title: "Professional Video Editor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 45,
      category: "Video Editing",
      skills: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
      available: true,
    },
    {
      id: 2,
      name: "Sarah Kim",
      title: "Motion Graphics Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      rating: 5.0,
      reviews: 89,
      hourlyRate: 60,
      category: "Animation",
      skills: ["After Effects", "Cinema 4D", "Blender"],
      available: true,
    },
    {
      id: 3,
      name: "Marcus Chen",
      title: "Music Producer & Sound Designer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      rating: 4.8,
      reviews: 156,
      hourlyRate: 55,
      category: "Music Production",
      skills: ["FL Studio", "Ableton", "Logic Pro"],
      available: false,
    },
    {
      id: 4,
      name: "Emily Watson",
      title: "Stream Overlay Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 203,
      hourlyRate: 35,
      category: "Graphic Design",
      skills: ["Photoshop", "Illustrator", "Figma"],
      available: true,
    },
    {
      id: 5,
      name: "David Park",
      title: "3D Artist & Animator",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      rating: 4.7,
      reviews: 78,
      hourlyRate: 70,
      category: "3D Modeling",
      skills: ["Blender", "Maya", "ZBrush"],
      available: true,
    },
    {
      id: 6,
      name: "Lisa Johnson",
      title: "Professional Voice Artist",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      rating: 4.9,
      reviews: 142,
      hourlyRate: 40,
      category: "Voice Over",
      skills: ["Narration", "Character Voices", "Commercial"],
      available: true,
    },
  ];

  const filteredFreelancers = freelancers.filter((f) => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            Freelance Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Find <span className="text-primary">Talented</span> Creators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connect with skilled freelancers to enhance your stream. From overlays to music, find the perfect collaborator.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search freelancers by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 border-y border-border bg-card/30">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="flex-shrink-0"
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Available Freelancers
            </h2>
            <span className="text-muted-foreground">
              {filteredFreelancers.length} results
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    {freelancer.available && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {freelancer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {freelancer.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-muted-foreground">({freelancer.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>${freelancer.hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="default" className="flex-1">
                    Contact
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredFreelancers.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No freelancers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Are You a Freelancer?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join our marketplace and connect with streamers looking for your skills. Set your own rates and work on exciting projects.
          </p>
          <Button variant="default" size="xl" className="glow">
            Become a Freelancer
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Freelance;
