import { useStreams } from "@/hooks/useStreams";
import StreamCard from "@/components/StreamCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DEMO_STREAMS = [
  {
    id: "demo-1",
    title: "Late Night Gaming Session",
    streamer: "GamerPro",
    category: "Gaming",
    thumbnail: "/placeholder.svg",
    avatar: "/placeholder.svg",
    viewers: 12500,
    isLive: true,
  },
  {
    id: "demo-2",
    title: "Music Production Live",
    streamer: "BeatMaker",
    category: "Music",
    thumbnail: "/placeholder.svg",
    avatar: "/placeholder.svg",
    viewers: 8300,
    isLive: true,
  },
  {
    id: "demo-3",
    title: "Creative Art Stream",
    streamer: "ArtistX",
    category: "Art",
    thumbnail: "/placeholder.svg",
    avatar: "/placeholder.svg",
    viewers: 5600,
    isLive: true,
  },
  {
    id: "demo-4",
    title: "Coding Tutorial",
    streamer: "DevGuru",
    category: "Education",
    thumbnail: "/placeholder.svg",
    avatar: "/placeholder.svg",
    viewers: 3200,
    isLive: true,
  },
];

const LiveStreamsSection = () => {
  const { data: streams, isLoading } = useStreams(undefined, true);

  const displayStreams = streams?.length > 0 
    ? streams.slice(0, 4).map(stream => ({
        id: stream.id,
        title: stream.title,
        streamer: stream.user_id,
        category: "Live",
        thumbnail: stream.thumbnail_url || "/placeholder.svg",
        avatar: "/placeholder.svg",
        viewers: stream.viewer_count || 0,
        isLive: stream.is_live,
      }))
    : DEMO_STREAMS;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Live Now</h2>
            <p className="text-muted-foreground mt-1">
              Watch your favorite creators streaming live
            </p>
          </div>
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/browse">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStreams.map((stream) => (
              <StreamCard key={stream.id} {...stream} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveStreamsSection;
