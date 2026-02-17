import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Eye, CheckCircle, Gift, DollarSign, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import PostCommentsSection from "@/components/posts/PostCommentsSection";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useVirtualGifts } from "@/hooks/useVirtualGifts";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

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

  // Fetch creator's services
  const { data: creatorServices = [] } = useQuery({
    queryKey: ["video-creator-services", post?.user_id],
    queryFn: async () => {
      const { data: freelancer } = await supabase
        .from("freelancers")
        .select("id")
        .eq("user_id", post!.user_id)
        .maybeSingle();
      if (!freelancer) return [];

      const { data: services } = await supabase
        .from("freelance_services")
        .select("id, title, price, category")
        .eq("freelancer_id", freelancer.id)
        .eq("is_active", true);
      return services || [];
    },
    enabled: !!post?.user_id,
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
              {/* Tip button */}
              {user && post.user_id !== user.id && (
                <VideoTipButton recipientId={post.user_id} postId={post.id} />
              )}
            </div>
          </div>

          {/* Creator services */}
          {creatorServices.length > 0 && (
            <div className="bg-secondary/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Services by {displayName}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {creatorServices.map((service) => (
                  <Link
                    key={service.id}
                    to={`/@${username}`}
                    className="flex items-center justify-between p-2 rounded-md bg-background hover:bg-accent transition-colors"
                  >
                    <span className="text-sm truncate">{service.title}</span>
                    <span className="text-sm font-semibold text-primary flex items-center shrink-0 ml-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      {service.price}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

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

// Tip button component for video posts
const VideoTipButton = ({ recipientId, postId }: { recipientId: string; postId: string }) => {
  const [open, setOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { data: gifts = [] } = useVirtualGifts();
  const { toast } = useToast();

  const handleSendTip = async () => {
    if (!selectedGift || !user) return;
    setSending(true);
    try {
      const gift = gifts.find((g) => g.id === selectedGift);
      if (!gift) throw new Error("Gift not found");

      const { error } = await supabase.from("gift_transactions").insert({
        gift_id: selectedGift,
        sender_id: user.id,
        recipient_id: recipientId,
        amount: gift.price,
        message: message || null,
      });
      if (error) throw error;

      await supabase.from("earnings").insert({
        user_id: recipientId,
        amount: gift.price * 0.8,
        type: "tip",
        source_id: postId,
        status: "completed",
      });

      toast({ title: "Tip sent! 🎉", description: `You sent a ${gift.name} ${gift.icon}!` });
      setOpen(false);
      setSelectedGift(null);
      setMessage("");
    } catch {
      toast({ title: "Failed to send tip", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const selected = gifts.find((g) => g.id === selectedGift);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <Gift className="w-4 h-4 text-primary" />
          Tip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Send a Tip
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {gifts.map((gift) => (
              <button
                key={gift.id}
                onClick={() => setSelectedGift(gift.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                  selectedGift === gift.id
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-1">{gift.icon}</div>
                <p className="text-xs font-medium truncate">{gift.name}</p>
                <p className="text-xs text-primary font-bold">${gift.price}</p>
              </button>
            ))}
          </div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            maxLength={200}
            className="resize-none"
          />
          <Button onClick={handleSendTip} disabled={!selectedGift || sending} className="w-full">
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : selected ? (
              <>
                {selected.icon} Send {selected.name} - ${selected.price.toFixed(2)}
              </>
            ) : (
              "Select a gift"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiscoveryVideo;
