import { useState } from "react";
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
    <div className="mt-3 space-y-2.5">
      {isLoading ? (
        <div className="flex justify-center py-3">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        comments.map((comment) => {
          const name = comment.profile?.display_name || comment.profile?.username || "User";
          const initial = name.charAt(0).toUpperCase();
          return (
            <div key={comment.id} className="flex gap-2.5 group">
              <Link to={`/${comment.profile?.username || ""}`} className="shrink-0">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                  {initial}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <Link to={`/${comment.profile?.username || ""}`} className="text-xs font-semibold text-foreground hover:underline">
                    {name}
                  </Link>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 mt-0.5">{comment.content}</p>
              </div>
              {user?.id === comment.user_id && (
                <button
                  className="p-1 rounded-full opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  onClick={() => deleteComment.mutate(comment.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })
      )}

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
          <Input
            placeholder="Reply..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-8 text-xs bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <Button
            size="sm"
            type="submit"
            disabled={!newComment.trim() || addComment.isPending}
            className="h-8 px-3 rounded-full text-xs"
          >
            {addComment.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          </Button>
        </form>
      )}
    </div>
  );
};

export default PostCommentsSection;
