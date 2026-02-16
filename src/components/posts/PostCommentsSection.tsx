import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Send, Loader2, User } from "lucide-react";
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
    <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
      {isLoading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        comments.map((comment) => {
          const name = comment.profile?.display_name || comment.profile?.username || "User";
          return (
            <div key={comment.id} className="flex gap-2 group">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-md px-3 py-1.5">
                  <Link to={`/@${comment.profile?.username || ""}`} className="text-xs font-medium text-foreground hover:underline">
                    {name}
                  </Link>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 px-1">
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
            className="h-7 text-xs"
          />
          <Button size="sm" type="submit" disabled={!newComment.trim() || addComment.isPending} className="h-7 px-2">
            <Send className="w-3 h-3" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default PostCommentsSection;
