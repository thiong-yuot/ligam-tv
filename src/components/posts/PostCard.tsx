import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Trash2,
  CheckCircle,
  PlayCircle,
  MoreHorizontal,
  User,
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
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { toggleLike, deletePost } = usePosts();
  const [showComments, setShowComments] = useState(false);

  const displayName = post.profile?.display_name || post.profile?.username || "User";
  const isOwner = user?.id === post.user_id;

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <Link to={`/@${post.profile?.username || ""}`} className="text-sm font-medium text-foreground hover:underline">
              {displayName}
            </Link>
            {post.profile?.is_verified && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
            {post.is_stream_replay && (
              <Badge variant="secondary" className="text-[10px] h-5">
                <PlayCircle className="w-3 h-3 mr-0.5" /> Replay
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => deletePost.mutate(post.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        {post.content && <p className="text-sm text-foreground mb-3 whitespace-pre-wrap">{post.content}</p>}

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className={`grid gap-1.5 mb-3 ${post.media_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {post.media_urls.map((url, i) => (
              <img key={i} src={url} alt="" className="w-full rounded-md object-cover max-h-80" loading="lazy" />
            ))}
          </div>
        )}

        {post.video_url && (
          <div className="mb-3">
            <video src={post.video_url} controls className="w-full rounded-md max-h-80" preload="metadata" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 gap-1 text-xs ${post.user_has_liked ? "text-destructive" : "text-muted-foreground"}`}
            onClick={() => {
              if (!user) return;
              toggleLike.mutate({ postId: post.id, isLiked: !!post.user_has_liked });
            }}
          >
            <Heart className={`w-3.5 h-3.5 ${post.user_has_liked ? "fill-current" : ""}`} />
            {post.like_count > 0 && post.like_count}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comment_count > 0 && post.comment_count}
          </Button>
        </div>

        {showComments && <PostCommentsSection postId={post.id} />}
      </CardContent>
    </Card>
  );
};

export default PostCard;
