import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Trash2,
  CheckCircle,
  PlayCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { usePosts, type Post } from "@/hooks/usePosts";
import PostCommentsSection from "./PostCommentsSection";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/user/${post.profile?.username || post.user_id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: displayName + "'s post", text: post.content || "", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Post link copied to clipboard" });
    }
  }, [post, toast]);

  const displayName = post.profile?.display_name || post.profile?.username || "User";
  const username = post.profile?.username || "";
  const initials = displayName.charAt(0).toUpperCase();
  const isOwner = user?.id === post.user_id;

  return (
    <article className="border-b border-border/30 py-4 first:pt-0">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <Link to={`/user/${username}`} className="shrink-0">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
            {initials}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to={`/user/${username}`} className="text-sm font-semibold text-foreground hover:underline truncate">
              {displayName}
            </Link>
            {post.profile?.is_verified && <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />}
            <span className="text-xs text-muted-foreground truncate">@{username}</span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
            {post.is_stream_replay && (
              <Badge variant="outline" className="text-[10px] h-4 border-primary/30 text-primary px-1.5 ml-1">
                <PlayCircle className="w-2.5 h-2.5 mr-0.5" /> replay
              </Badge>
            )}
          </div>

          {/* Content */}
          {post.content && (
            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          )}

          {/* Images */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div
              className={`mt-3 rounded-xl overflow-hidden border border-border/30 ${
                post.media_urls.length === 1
                  ? ""
                  : post.media_urls.length === 2
                  ? "grid grid-cols-2 gap-0.5"
                  : post.media_urls.length === 3
                  ? "grid grid-cols-2 gap-0.5"
                  : "grid grid-cols-2 gap-0.5"
              }`}
            >
              {post.media_urls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className={`w-full object-cover ${
                    post.media_urls.length === 1
                      ? "max-h-[400px] rounded-xl"
                      : post.media_urls.length === 3 && i === 0
                      ? "row-span-2 h-full"
                      : "h-48"
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Video */}
          {post.video_url && (
            <div className="mt-3 rounded-xl overflow-hidden border border-border/30">
              <video
                src={post.video_url}
                controls
                className="w-full max-h-[400px]"
                preload="metadata"
                playsInline
              />
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center gap-6 mt-3 -ml-2">
            <button
              className={`flex items-center gap-1.5 text-xs transition-colors group ${
                post.user_has_liked
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-destructive"
              }`}
              onClick={() => {
                if (!user) return;
                toggleLike.mutate({ postId: post.id, isLiked: !!post.user_has_liked });
              }}
            >
              <div className="p-1.5 rounded-full group-hover:bg-destructive/10 transition-colors">
                <Heart className={`w-4 h-4 ${post.user_has_liked ? "fill-current" : ""}`} />
              </div>
              {post.like_count > 0 && <span>{post.like_count}</span>}
            </button>

            <button
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
              onClick={() => setShowComments(!showComments)}
            >
              <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              {post.comment_count > 0 && <span>{post.comment_count}</span>}
            </button>

            <button onClick={handleShare} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group">
              <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                <Share2 className="w-4 h-4" />
              </div>
            </button>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-auto p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => deletePost.mutate(post.id)} className="text-destructive text-xs">
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {showComments && <PostCommentsSection postId={post.id} />}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
