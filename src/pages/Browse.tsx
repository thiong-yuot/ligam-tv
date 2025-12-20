import { useState } from "react";
import Layout from "@/components/Layout";
import StreamCard from "@/components/StreamCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid3X3, LayoutGrid } from "lucide-react";

import streamThumb1 from "@/assets/stream-thumb-1.jpg";
import streamThumb2 from "@/assets/stream-thumb-2.jpg";
import streamThumb3 from "@/assets/stream-thumb-3.jpg";

const Browse = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  const filters = [
    { id: "all", label: "All" },
    { id: "gaming", label: "Gaming" },
    { id: "music", label: "Music" },
    { id: "art", label: "Art" },
    { id: "esports", label: "Esports" },
    { id: "just-chatting", label: "Just Chatting" },
  ];

  const streams = [
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
    {
      id: "7",
      title: "Retro Gaming Night",
      streamer: "ClassicGamer",
      category: "Gaming",
      thumbnail: streamThumb1,
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop",
      viewers: 2100,
      isLive: true,
    },
    {
      id: "8",
      title: "Live Concert Stream",
      streamer: "MusicLive",
      category: "Music",
      thumbnail: streamThumb2,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
      viewers: 18500,
      isLive: true,
    },
  ];

  const filteredStreams = activeFilter === "all" 
    ? streams 
    : streams.filter(s => s.category.toLowerCase().replace(" ", "-") === activeFilter);

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Browse
          </h1>
          <p className="text-muted-foreground">
            Discover live streams from creators around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search streams..."
              className="pl-10 bg-secondary border-border"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "compact" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("compact")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="rounded-full"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredStreams.length} streams live
        </p>

        {/* Stream Grid */}
        <div className={`grid gap-4 md:gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }`}>
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

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" size="lg">
            Load More Streams
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
