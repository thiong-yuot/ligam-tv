import Layout from "@/components/Layout";
import FeaturedStream from "@/components/FeaturedStream";
import StreamCard from "@/components/StreamCard";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

// Import images
import heroFeatured from "@/assets/hero-featured.jpg";
import categoryGaming from "@/assets/category-gaming.jpg";
import categoryMusic from "@/assets/category-music.jpg";
import streamThumb1 from "@/assets/stream-thumb-1.jpg";
import streamThumb2 from "@/assets/stream-thumb-2.jpg";
import streamThumb3 from "@/assets/stream-thumb-3.jpg";

const Index = () => {
  // Mock data for live streams
  const liveStreams = [
    {
      id: "1",
      title: "Epic Gaming Marathon - Day 3!",
      streamer: "NightOwl",
      category: "Gaming",
      thumbnail: streamThumb1,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      viewers: 15420,
      isLive: true,
    },
    {
      id: "2",
      title: "Live DJ Set - House Music Vibes",
      streamer: "BeatMaster",
      category: "Music",
      thumbnail: streamThumb2,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      viewers: 8930,
      isLive: true,
    },
    {
      id: "3",
      title: "Digital Art Creation - Fantasy Theme",
      streamer: "ArtistPro",
      category: "Art",
      thumbnail: streamThumb3,
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      viewers: 4250,
      isLive: true,
    },
    {
      id: "4",
      title: "Competitive Ranked Gameplay",
      streamer: "ProGamer99",
      category: "Esports",
      thumbnail: streamThumb1,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      viewers: 12800,
      isLive: true,
    },
    {
      id: "5",
      title: "Chill Stream - Just Chatting",
      streamer: "StreamQueen",
      category: "Just Chatting",
      thumbnail: streamThumb2,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      viewers: 6540,
      isLive: true,
    },
    {
      id: "6",
      title: "Music Production Session",
      streamer: "SoundWave",
      category: "Music",
      thumbnail: streamThumb3,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      viewers: 3200,
      isLive: true,
    },
  ];

  const categories = [
    {
      id: "gaming",
      name: "Gaming",
      image: categoryGaming,
      viewers: 285000,
      tags: ["Action", "RPG"],
    },
    {
      id: "music",
      name: "Music",
      image: categoryMusic,
      viewers: 125000,
      tags: ["Live DJ", "Production"],
    },
    {
      id: "art",
      name: "Art",
      image: streamThumb3,
      viewers: 45000,
      tags: ["Digital", "Traditional"],
    },
    {
      id: "esports",
      name: "Esports",
      image: streamThumb1,
      viewers: 180000,
      tags: ["Tournament", "Pro"],
    },
  ];

  const featuredStream = {
    id: "featured-1",
    title: "Championship Finals - Live Tournament",
    streamer: "LigamEsports",
    category: "Esports",
    thumbnail: heroFeatured,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    viewers: 156000,
    description: "Watch the most intense esports action as top teams compete for the championship title. Live commentary, exclusive interviews, and incredible gameplay!",
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Featured Stream Section */}
        <section className="p-4 md:p-6 lg:p-8">
          <FeaturedStream {...featuredStream} />
        </section>

        {/* Live Channels Section */}
        <section className="px-4 md:px-6 lg:px-8 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Live Now
                </h2>
                <p className="text-sm text-muted-foreground">
                  Top streams happening right now
                </p>
              </div>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="group">
                View All
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {liveStreams.map((stream, index) => (
              <div
                key={stream.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <StreamCard {...stream} />
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-4 md:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Popular Categories
                </h2>
                <p className="text-sm text-muted-foreground">
                  Explore content you love
                </p>
              </div>
            </div>
            <Link to="/categories">
              <Button variant="ghost" className="group">
                All Categories
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-6 lg:px-8 pb-12">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-ligam-teal/20 via-ligam-purple/20 to-ligam-pink/20 p-8 md:p-12">
            <div className="absolute inset-0 bg-card/50 backdrop-blur-sm" />
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-4">
                Start Your Streaming Journey
              </h2>
              <p className="text-muted-foreground mb-8">
                Join millions of creators and viewers on Ligam.tv. Share your passion,
                build your community, and go live today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Start Streaming
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
