import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StreamCard from "@/components/StreamCard";
import { ArrowRight, Loader2, Radio } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  thumbnail_url: string | null;
  viewer_count: number | null;
  is_live: boolean | null;
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  categories?: {
    name: string;
  } | null;
}

// Sample streams for demo purposes
const sampleStreams: Stream[] = [
  {
    id: "demo-stream-1",
    title: "Building a Full-Stack App from Scratch",
    thumbnail_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    viewer_count: 567,
    is_live: true,
    profiles: {
      display_name: "Sarah Codes",
      username: "sarahcodes",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Programming" }
  },
  {
    id: "demo-stream-2",
    title: "Pro Gaming Session - Ranked Matches",
    thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    viewer_count: 1234,
    is_live: true,
    profiles: {
      display_name: "Marcus Gaming",
      username: "marcusgaming",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Gaming" }
  },
  {
    id: "demo-stream-3",
    title: "Live Music Production Session",
    thumbnail_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop",
    viewer_count: 892,
    is_live: true,
    profiles: {
      display_name: "Aria Music",
      username: "ariamusic",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Music" }
  },
  {
    id: "demo-stream-4",
    title: "Morning HIIT Workout - Join Live!",
    thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    viewer_count: 445,
    is_live: true,
    profiles: {
      display_name: "Alex Fitness",
      username: "alexfitness",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Fitness" }
  },
  {
    id: "demo-stream-5",
    title: "Digital Art Creation - Character Design",
    thumbnail_url: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=600&h=400&fit=crop",
    viewer_count: 723,
    is_live: true,
    profiles: {
      display_name: "Luna Art",
      username: "lunaart",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Art" }
  },
  {
    id: "demo-stream-6",
    title: "Cooking Masterclass - Italian Cuisine",
    thumbnail_url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
    viewer_count: 389,
    is_live: true,
    profiles: {
      display_name: "Chef Marco",
      username: "chefmarco",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Cooking" }
  },
  {
    id: "demo-stream-7",
    title: "Yoga & Meditation - Morning Flow",
    thumbnail_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    viewer_count: 512,
    is_live: true,
    profiles: {
      display_name: "Maya Zen",
      username: "mayazen",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Wellness" }
  },
  {
    id: "demo-stream-8",
    title: "Stock Trading Live Analysis",
    thumbnail_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    viewer_count: 1567,
    is_live: true,
    profiles: {
      display_name: "Trading Pro",
      username: "tradingpro",
      avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face"
    },
    categories: { name: "Finance" }
  }
];

interface LiveStreamsSectionProps {
  streams: Stream[];
  isLoading: boolean;
}

const LiveStreamsSection = ({ streams, isLoading }: LiveStreamsSectionProps) => {
  // Use sample data if no real streams available
  const displayStreams = streams.length > 0 ? streams : sampleStreams;
  const liveStreams = displayStreams.filter(s => s.is_live);
  
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-destructive animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Live Now
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
              {liveStreams.length} streaming
            </span>
          </div>
          <Link to="/browse">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Streams Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : liveStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liveStreams.slice(0, 8).map((stream, index) => (
              <div
                key={stream.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <StreamCard
                  id={stream.id}
                  title={stream.title}
                  streamer={stream.profiles?.display_name || stream.profiles?.username || "Unknown"}
                  category={stream.categories?.name || "Uncategorized"}
                  thumbnail={stream.thumbnail_url || "/placeholder.svg"}
                  avatar={stream.profiles?.avatar_url || "/placeholder.svg"}
                  viewers={stream.viewer_count || 0}
                  isLive={stream.is_live || false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-border">
            <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No one is live right now
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to go live and start streaming!
            </p>
            <Link to="/go-live">
              <Button>Start Streaming</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveStreamsSection;
