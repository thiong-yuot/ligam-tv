import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayCircle, Upload, Clock, MoreVertical, Briefcase, DollarSign } from "lucide-react";
import UploadVideoDialog from "@/components/discovery/UploadVideoDialog";
import { formatDistanceToNow } from "date-fns";

export interface DiscoveryItem {
  id: string;
  title: string;
  thumbnail_url: string | null;
  video_url: string | null;
  view_count: number;
  created_at: string;
  type: "video" | "replay";
  user_id: string;
  creator: {
    display_name: string | null;
    username: string | null;
  } | null;
}

interface FreelancerService {
  id: string;
  title: string;
  price: number;
  category: string | null;
  freelancer_id: string;
}

const Discovery = () => {
  const { user } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);

  // Fetch video posts
  const { data: videoPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["discovery-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, video_url, media_urls, view_count, created_at, user_id, is_stream_replay")
        .eq("is_published", true)
        .not("video_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      const userIds = [...new Set((data || []).map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username")
        .in("user_id", userIds);
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      return (data || []).map((p): DiscoveryItem => ({
        id: p.id,
        title: p.content?.split("\n")[0] || "Untitled Video",
        thumbnail_url: p.media_urls?.[0] || null,
        video_url: p.video_url,
        view_count: p.view_count || 0,
        created_at: p.created_at,
        type: p.is_stream_replay ? "replay" : "video",
        user_id: p.user_id,
        creator: profileMap.get(p.user_id) || null,
      }));
    },
  });

  // Fetch ended streams (replays)
  const { data: streamReplays = [], isLoading: streamsLoading } = useQuery({
    queryKey: ["discovery-streams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("id, title, thumbnail_url, hls_url, preview_video_url, total_views, created_at, user_id, ended_at")
        .eq("is_live", false)
        .not("ended_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      const userIds = [...new Set((data || []).map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username")
        .in("user_id", userIds);
      const profileMap = new Map((profiles || []).map((p) => [p.user_id, p]));

      return (data || []).map((s): DiscoveryItem => ({
        id: `stream-${s.id}`,
        title: s.title,
        thumbnail_url: s.thumbnail_url,
        video_url: s.preview_video_url || s.hls_url,
        view_count: s.total_views || 0,
        created_at: s.created_at!,
        type: "replay",
        user_id: s.user_id,
        creator: profileMap.get(s.user_id) || null,
      }));
    },
  });

  // Fetch all freelancer services mapped by user_id
  const { data: servicesMap = new Map() } = useQuery({
    queryKey: ["discovery-services"],
    queryFn: async () => {
      // Get all freelancers
      const { data: freelancers } = await supabase
        .from("freelancers")
        .select("id, user_id");
      if (!freelancers?.length) return new Map<string, FreelancerService[]>();

      const freelancerUserMap = new Map(freelancers.map((f) => [f.id, f.user_id]));
      const freelancerIds = freelancers.map((f) => f.id);

      const { data: services } = await supabase
        .from("freelance_services")
        .select("id, title, price, category, freelancer_id")
        .eq("is_active", true)
        .in("freelancer_id", freelancerIds);

      const map = new Map<string, FreelancerService[]>();
      (services || []).forEach((s) => {
        const userId = freelancerUserMap.get(s.freelancer_id);
        if (userId) {
          const existing = map.get(userId) || [];
          existing.push(s);
          map.set(userId, existing);
        }
      });
      return map;
    },
  });

  const isLoading = postsLoading || streamsLoading;
  const allItems = [...videoPosts, ...streamReplays].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-foreground">Discovery</h1>
          {user && (
            <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-1.5">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-20">
            <PlayCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No videos yet. Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
            {allItems.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                services={servicesMap.get(item.user_id) || []}
              />
            ))}
          </div>
        )}
      </div>

      {user && <UploadVideoDialog open={uploadOpen} onOpenChange={setUploadOpen} />}
    </Layout>
  );
};

const VideoCard = ({
  item,
  services,
}: {
  item: DiscoveryItem;
  services: FreelancerService[];
}) => {
  const linkTo = item.id.startsWith("stream-")
    ? `/stream/${item.id.replace("stream-", "")}`
    : `/discovery/${item.id}`;

  const creatorName = item.creator?.display_name || item.creator?.username || "Unknown";
  const username = item.creator?.username || "";
  const initials = creatorName.charAt(0).toUpperCase();

  return (
    <div className="group">
      {/* Thumbnail */}
      <Link to={linkTo} className="block">
        <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden mb-2">
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircle className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-90 transition-opacity drop-shadow-lg" />
          </div>
          {item.type === "replay" && (
            <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] h-5">
              <Clock className="w-3 h-3 mr-0.5" /> Replay
            </Badge>
          )}
        </div>
      </Link>

      {/* Info row */}
      <div className="flex gap-2.5">
        <Link to={`/@${username}`} className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
            {initials}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={linkTo}>
            <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </Link>
          <Link to={`/@${username}`} className="block">
            <p className="text-xs text-muted-foreground mt-0.5 hover:text-foreground transition-colors">
              {creatorName}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground">
            {item.view_count.toLocaleString()} views · {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </p>
        </div>

        {/* 3-dot menu with services */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 mt-0.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg z-50">
            <DropdownMenuItem asChild>
              <Link to={`/@${username}`} className="cursor-pointer">
                View channel
              </Link>
            </DropdownMenuItem>
            {services.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" />
                  Services by {creatorName}
                </DropdownMenuLabel>
                {services.map((service) => (
                  <DropdownMenuItem key={service.id} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm truncate mr-2">{service.title}</span>
                    <span className="text-xs font-semibold text-primary flex items-center shrink-0">
                      <DollarSign className="w-3 h-3" />
                      {service.price}
                    </span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Discovery;
