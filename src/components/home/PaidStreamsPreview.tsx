import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Eye, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const usePaidStreams = () => {
  return useQuery({
    queryKey: ["paid-streams-preview"],
    queryFn: async () => {
      const { data: streams, error } = await supabase
        .from("streams")
        .select("id, title, thumbnail_url, viewer_count, is_live, access_price, user_id, preview_video_url")
        .eq("is_paid", true)
        .order("viewer_count", { ascending: false })
        .limit(4);

      if (error) throw error;
      if (!streams || streams.length === 0) return [];

      const userIds = [...new Set(streams.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url")
        .in("user_id", userIds);

      return streams.map((s) => {
        const profile = (profiles || []).find((p) => p.user_id === s.user_id);
        return { ...s, profile };
      });
    },
    staleTime: 30000,
  });
};

const PaidStreamsPreview = () => {
  const { data: streams = [], isLoading } = usePaidStreams();

  return (
    <section className="py-4 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-display font-bold text-foreground">Paid Sessions</h2>
          </div>
          <Link to="/browse">
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-2 space-y-1.5">
                  <div className="h-2.5 bg-muted rounded w-2/3" />
                  <div className="h-2 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : streams.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {streams.map((stream) => (
              <Link
                key={stream.id}
                to={`/stream/${stream.id}`}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-muted-foreground/30 transition-all group"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={stream.thumbnail_url || "/placeholder.svg"}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-background/40" />

                  {stream.is_live && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded flex items-center gap-1">
                      <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      LIVE
                    </span>
                  )}

                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded">
                    ${stream.access_price?.toFixed(2)}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
                    </div>
                  </div>

                  {stream.viewer_count != null && stream.viewer_count > 0 && (
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-background/80 backdrop-blur-sm text-foreground text-[10px] rounded flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      {stream.viewer_count}
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <p className="text-[11px] font-medium text-foreground truncate">{stream.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {stream.profile?.display_name || stream.profile?.username || "Creator"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-card border border-border rounded-lg">
            <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-muted-foreground text-xs">No paid sessions yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaidStreamsPreview;
