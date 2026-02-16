import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePostComments } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const PostCommentsSection = ({ postId }: { postId: string }) => {
  const { user } = useAuth();
  const { comments, isLoading, addComment, deleteComment } = usePostComments(postId);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addComment.mutateAsync(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        comments.map((comment) => {
          const name = comment.profile?.display_name || comment.profile?.username || "User";
          const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
          return (
            <div key={comment.id} className="flex gap-2 group">
              <Link to={`/@${comment.profile?.username || ""}`}>
                <Avatar className="w-7 h-7">
                  <AvatarImage src={comment.profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <Link to={`/@${comment.profile?.username || ""}`} className="text-xs font-semibold text-foreground hover:underline">
                    {name}
                  </Link>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 px-1">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
              </div>
              {user?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground"
                  onClick={() => deleteComment.mutate(comment.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })
      )}

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-8 text-sm"
          />
          <Button size="sm" type="submit" disabled={!newComment.trim() || addComment.isPending} className="h-8">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default PostCommentsSection;
