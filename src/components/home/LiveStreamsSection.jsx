import { useStreams } from "@/hooks/useStreams";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    viewers: 12500,
    isLive: true,
  },
  {
    id: "demo-2",
    title: "Music Production Live",
    streamer: "BeatMaker",
    category: "Music",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop",
    viewers: 8300,
    isLive: true,
  },
  {
    id: "demo-3",
    title: "Creative Art Stream",
    streamer: "ArtistX",
    category: "Art",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=450&fit=crop",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    viewers: 5600,
    isLive: true,
  },
  {
    id: "demo-4",
    title: "Coding Tutorial",
    streamer: "DevGuru",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    viewers: 3200,
    isLive: true,
  },
];

const LiveStreamsSection = () => {
  const { data: streams, isLoading } = useStreams(undefined, true);

  // Fetch profiles for stream creators
  const userIds = streams?.map(s => s.user_id).filter(Boolean) || [];
  const { data: profiles } = useQuery({
    queryKey: ["stream-creator-profiles", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return {};
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .in("user_id", userIds);
      if (error) throw error;
      return (data || []).reduce((acc, p) => {
        acc[p.user_id] = p;
        return acc;
      }, {});
    },
    enabled: userIds.length > 0,
  });

  const displayStreams = streams?.length > 0 
    ? streams.slice(0, 4).map(stream => {
        const profile = profiles?.[stream.user_id];
        return {
          id: stream.id,
          title: stream.title,
          streamer: profile?.display_name || profile?.username || "Creator",
          category: "Live",
          thumbnail: stream.thumbnail_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
          avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
          viewers: stream.viewer_count || 0,
          isLive: stream.is_live,
        };
      })
    : DEMO_STREAMS;

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Live Now</h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Watch your favorite creators streaming live
            </p>
          </div>
          <Button variant="ghost" asChild className="gap-2 text-sm">
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
