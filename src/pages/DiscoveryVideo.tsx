import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Eye, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import PostCommentsSection from "@/components/posts/PostCommentsSection";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const DiscoveryVideo = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toggleLike } = usePosts();
  const [showComments, setShowComments] = useState(true);

  const { data: post, isLoading } = useQuery({
    queryKey: ["discovery-video", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, is_verified")
        .eq("user_id", data.user_id)
        .single();

      let userHasLiked = false;
      if (user) {
        const { data: like } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", data.id)
          .eq("user_id", user.id)
          .maybeSingle();
        userHasLiked = !!like;
      }

      return { ...data, profile, user_has_liked: userHasLiked };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="aspect-video w-full max-w-4xl mx-auto rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Video not found.</p>
          <Button asChild className="mt-4"><Link to="/discovery">Back to Discovery</Link></Button>
        </div>
      </Layout>
    );
  }

  const titleLine = post.content?.split("\n")[0] || "Untitled";
  const description = post.content?.split("\n").slice(1).join("\n").trim() || "";
  const displayName = post.profile?.display_name || post.profile?.username || "User";
  const username = post.profile?.username || "";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Video player */}
          {post.video_url && (
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
              <video
                src={post.video_url}
                controls
                autoPlay
                className="w-full h-full"
                playsInline
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-lg font-bold text-foreground mb-2">{titleLine}</h1>

          {/* Meta row */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Link to={`/@${username}`} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-foreground">{displayName}</span>
                    {post.profile?.is_verified && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </div>
              </Link>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(post.view_count || 0).toLocaleString()} views
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={post.user_has_liked ? "default" : "outline"}
                size="sm"
                className="gap-1.5 h-8"
                onClick={() => {
                  if (!user) return;
                  toggleLike.mutate({ postId: post.id, isLiked: !!post.user_has_liked });
                }}
              >
                <Heart className={`w-4 h-4 ${post.user_has_liked ? "fill-current" : ""}`} />
                {post.like_count || 0}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => setShowComments(!showComments)}>
                <MessageCircle className="w-4 h-4" />
                {post.comment_count || 0}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="bg-secondary/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{description}</p>
            </div>
          )}

          {/* Comments */}
          {showComments && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-3">{post.comment_count || 0} Comments</h3>
              <PostCommentsSection postId={post.id} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiscoveryVideo;
