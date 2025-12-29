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

interface LiveStreamsSectionProps {
  streams: Stream[];
  isLoading: boolean;
}

const LiveStreamsSection = ({ streams, isLoading }: LiveStreamsSectionProps) => {
  const liveStreams = streams.filter(s => s.is_live);
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
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
