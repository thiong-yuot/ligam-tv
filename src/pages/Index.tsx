import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreamCard from "@/components/StreamCard";
import StatsBar from "@/components/StatsBar";
import CategoryFilter from "@/components/CategoryFilter";
import VirtualGifts from "@/components/VirtualGifts";
import WhyChooseLigam from "@/components/WhyChooseLigam";
import GetFeatured from "@/components/GetFeatured";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight } from "lucide-react";

import streamThumb1 from "@/assets/stream-thumb-1.jpg";
import streamThumb2 from "@/assets/stream-thumb-2.jpg";
import streamThumb3 from "@/assets/stream-thumb-3.jpg";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All", "Gaming", "Music", "Creative", "Talk Shows", 
    "Coding", "Fitness", "Lifestyle", "Entertainment", "Education"
  ];

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
      category: "Creative",
      thumbnail: streamThumb3,
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      viewers: 4250,
      isLive: true,
    },
    {
      id: "4",
      title: "Competitive Ranked Gameplay",
      streamer: "ProGamer99",
      category: "Gaming",
      thumbnail: streamThumb1,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      viewers: 12800,
      isLive: true,
    },
    {
      id: "5",
      title: "Late Night Talk Show",
      streamer: "StreamQueen",
      category: "Talk Shows",
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

  const filteredStreams = activeCategory === "All" 
    ? liveStreams 
    : liveStreams.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Stream, Connect <span className="text-primary">&</span> Monetize
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of creators building their communities on Ligam. Stream live, engage with viewers, and earn from your passion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/create-profile">
              <Button variant="default" size="xl" className="glow">
                Start Streaming
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="xl">
                Explore Streams
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            All sign-ups and logins are securely handled with industry-standard encryption.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 border-y border-border bg-card/30">
        <div className="container mx-auto">
          <StatsBar liveStreams={0} categories={0} creators="10K+" />
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Live Streams Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              All Live Streams
            </h2>
            <span className="text-muted-foreground">
              {filteredStreams.length} streams live
            </span>
          </div>

          {filteredStreams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStreams.map((stream, index) => (
                <div
                  key={stream.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <StreamCard {...stream} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No live streams in this category
              </h3>
              <p className="text-muted-foreground">
                Check back soon or explore other categories
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Trending Now
          </h2>
          <p className="text-muted-foreground mb-8">Most watched categories</p>
          
          <div className="text-center py-12 text-muted-foreground">
            No trending data available yet
          </div>
        </div>
      </section>

      {/* Why Choose Ligam */}
      <WhyChooseLigam />

      {/* Virtual Gifts */}
      <VirtualGifts />

      {/* Get Featured */}
      <GetFeatured />

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Ready to Start Streaming?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands of creators building their communities on Ligam. Start streaming today and reach your audience.
          </p>
          <Link to="/create-profile">
            <Button variant="default" size="xl" className="glow">
              Start Streaming Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Bottom Stats */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <StatsBar liveStreams={0} categories={0} creators="10K+" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
