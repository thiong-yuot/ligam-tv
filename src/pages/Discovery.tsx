import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlayCircle, Upload } from "lucide-react";
import UploadVideoDialog from "@/components/discovery/UploadVideoDialog";
import DiscoveryFilters from "@/components/discovery/DiscoveryFilters";
import VideoCard from "@/components/discovery/VideoCard";

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
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("all");

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

  // Fetch freelancer services mapped by user_id
  const { data: servicesMap = new Map() } = useQuery({
    queryKey: ["discovery-services"],
    queryFn: async () => {
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

  // Combined, filtered, sorted items
  const filteredItems = useMemo(() => {
    let items = [...videoPosts, ...streamReplays];

    // Filter by type
    if (filterType === "video") items = items.filter((i) => i.type === "video");
    if (filterType === "replay") items = items.filter((i) => i.type === "replay");

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.creator?.display_name?.toLowerCase().includes(q) ||
          i.creator?.username?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "newest") items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sortBy === "oldest") items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    if (sortBy === "most_viewed") items.sort((a, b) => b.view_count - a.view_count);

    return items;
  }, [videoPosts, streamReplays, filterType, search, sortBy]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-foreground">Discovery</h1>
          {user && (
            <Button size="sm" onClick={() => setUploadOpen(true)} className="gap-1.5">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          )}
        </div>

        {/* Filters */}
        <DiscoveryFilters
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
        />

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
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <PlayCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {search || filterType !== "all" ? "No videos match your filters." : "No videos yet. Be the first to upload!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
            {filteredItems.map((item) => (
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

export default Discovery;
