import { useState, useCallback, useEffect } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HLSVideoPlayer from "@/components/HLSVideoPlayer";
import HighlightedTip from "@/components/HighlightedTip";
import StreamGifts from "@/components/stream/StreamGifts";
import TipDialog from "@/components/TipDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Users, 
  Send,
  Loader2,
  Crown,
  Lock,
  Play,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import EmojiPicker from "@/components/stream/EmojiPicker";
import { useStream } from "@/hooks/useStreams";
import { useChatMessages, useSendMessage } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useCheckStreamAccess, useCreateStreamCheckout, useVerifyStreamAccess } from "@/hooks/useStreamAccess";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/hooks/useFollowers";
import { useToast } from "@/hooks/use-toast";

const StreamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chatMessage, setChatMessage] = useState("");
  const [highlightedTips, setHighlightedTips] = useState<Array<{
    id: string;
    senderName: string;
    giftName: string;
    giftIcon: string;
    amount: number;
    message?: string;
  }>>([]);
  const { toast } = useToast();

  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const { user } = useAuth();
  const { tier } = useSubscription();
  const { data: stream, isLoading } = useStream(id || "");
  const { data: accessInfo, isLoading: accessLoading, refetch: refetchAccess } = useCheckStreamAccess(id || "");
  const messages = useChatMessages(id || "");
  const sendMessage = useSendMessage();
  const createStreamCheckout = useCreateStreamCheckout();
  const verifyStreamAccess = useVerifyStreamAccess();

  const { data: isFollowing = false } = useIsFollowing(stream?.user_id || "");
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const handleToggleFollow = () => {
    if (!stream?.user_id) return;
    if (!user) {
      toast({ title: "Login Required", description: "Please login to follow streamers", variant: "destructive" });
      return;
    }
    if (isFollowing) {
      unfollowUser.mutate(stream.user_id);
    } else {
      followUser.mutate(stream.user_id);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: stream?.title || "Stream", url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Stream link copied to clipboard" });
    }
  };

  useEffect(() => {
    const accessParam = searchParams.get('access');
    const sessionId = searchParams.get('session_id');
    if (accessParam === 'granted' && sessionId && id) {
      verifyStreamAccess.mutate({ sessionId, streamId: id }, {
        onSuccess: () => { toast({ title: "Access Granted!", description: "You now have access to this stream." }); refetchAccess(); },
        onError: (error) => { toast({ title: "Verification Error", description: error.message, variant: "destructive" }); },
      });
    }
  }, [searchParams, id]);

  const hlsUrl = stream?.hls_url || null;

  const handleViewerJoin = useCallback(async () => {
    if (stream?.id) await supabase.functions.invoke("rtmp-webhook", { body: { action: "on_play", stream_id: stream.id } });
  }, [stream?.id]);

  const handleViewerLeave = useCallback(async () => {
    if (stream?.id) await supabase.functions.invoke("rtmp-webhook", { body: { action: "on_play_done", stream_id: stream.id } });
  }, [stream?.id]);

  const handlePurchaseAccess = async () => {
    if (!user) { toast({ title: "Login Required", description: "Please login to purchase stream access", variant: "destructive" }); return; }
    try {
      const result = await createStreamCheckout.mutateAsync(id!);
      if (result.url) window.location.href = result.url;
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to create checkout", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !id) return;
    try {
      await sendMessage.mutateAsync({ streamId: id, message: chatMessage });
      setChatMessage("");
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to send message", variant: "destructive" });
    }
  };

  const formatViewers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading || accessLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Stream Not Found</h1>
          <p className="text-muted-foreground mb-6">This stream doesn't exist or has ended.</p>
          <Link to="/browse"><Button>Browse Streams</Button></Link>
        </div>
      </div>
    );
  }

  const isPaidStream = accessInfo?.isPaid;
  const hasAccess = accessInfo?.hasAccess;
  const streamPrice = accessInfo?.price || 0;

  const PaidStreamPaywall = () => (
    <div className="relative aspect-video bg-secondary flex items-center justify-center">
      {stream.thumbnail_url && (
        <img src={stream.thumbnail_url} alt={stream.title} className="w-full h-full object-cover absolute inset-0 opacity-30" />
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <Card className="max-w-md mx-4 p-6 text-center bg-card/95 border-primary/20">
          <Lock className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-bold text-foreground mb-1">{stream.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">Purchase access to watch this stream.</p>
          <div className="text-2xl font-bold text-foreground mb-1">${streamPrice.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mb-4">One-time payment</p>
          <Button onClick={handlePurchaseAccess} disabled={createStreamCheckout.isPending} className="w-full">
            {createStreamCheckout.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Crown className="w-4 h-4 mr-2" />}
            Purchase Access
          </Button>
          {!user && <p className="text-xs text-muted-foreground mt-2"><Link to="/auth" className="text-primary hover:underline">Login</Link> to purchase</p>}
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className={cn("pt-16 flex flex-col lg:flex-row min-h-screen", isTheaterMode && "fixed inset-0 pt-0 z-50 bg-background")}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video */}
          <div className="relative group">
            {isPaidStream && !hasAccess ? (
              <PaidStreamPaywall />
            ) : stream.is_live && hlsUrl ? (
              <HLSVideoPlayer
                src={hlsUrl}
                poster={stream.thumbnail_url || undefined}
                isLive={stream.is_live}
                isTheaterMode={isTheaterMode}
                onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                onViewerJoin={handleViewerJoin}
                onViewerLeave={handleViewerLeave}
              />
            ) : (
              <div className="relative aspect-video bg-secondary flex items-center justify-center">
                {stream.thumbnail_url ? (
                  <img src={stream.thumbnail_url} alt={stream.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Stream Offline</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Compact Stream Info */}
          <div className="p-3 md:p-4 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full ring-2 ring-primary bg-secondary flex-shrink-0 flex items-center justify-center">
                <span className="text-sm font-bold text-foreground">
                  {(stream.profiles?.display_name || stream.profiles?.username || "S").charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-foreground truncate">{stream.title}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-primary">
                    {stream.profiles?.display_name || stream.profiles?.username || "Streamer"}
                  </span>
                  <span>•</span>
                  <span>{formatViewers(stream.viewer_count || 0)} viewers</span>
                  {isPaidStream && hasAccess && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> Access
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                variant={isFollowing ? "secondary" : "default"}
                size="sm"
                onClick={handleToggleFollow}
                disabled={followUser.isPending || unfollowUser.isPending}
                className="h-8 text-xs"
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowing ? "fill-current" : ""}`} />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              {stream?.user_id && (
                <TipDialog
                  streamId={stream.id}
                  recipientId={stream.user_id}
                  onTipSent={(tip) => {
                    setHighlightedTips(prev => [...prev, {
                      id: crypto.randomUUID(),
                      senderName: user?.email?.split('@')[0] || "Anonymous",
                      giftName: tip.giftName,
                      giftIcon: tip.giftIcon,
                      amount: tip.amount,
                      message: tip.message,
                    }]);
                  }}
                />
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 border-l border-border flex flex-col bg-card">
          {/* Chat header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Chat</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{formatViewers(stream.viewer_count || 0)}</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 min-h-[300px] lg:min-h-0 scroll-smooth"
            ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}
          >
            {highlightedTips.map((tip) => (
              <HighlightedTip
                key={tip.id}
                senderName={tip.senderName}
                giftName={tip.giftName}
                giftIcon={tip.giftIcon}
                amount={tip.amount}
                message={tip.message}
              />
            ))}

            {messages.length === 0 && highlightedTips.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Say something to start the chat.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const nameColors = [
                  "text-red-400", "text-blue-400", "text-green-400",
                  "text-yellow-400", "text-pink-400", "text-purple-400",
                  "text-orange-400", "text-teal-400", "text-cyan-400",
                  "text-emerald-400", "text-rose-400", "text-indigo-400",
                ];
                const colorIndex = msg.user_id ? msg.user_id.charCodeAt(0) % nameColors.length : 0;
                const displayName = msg.profiles?.display_name || msg.profiles?.username || (msg.user_id === "00000000-0000-0000-0000-000000000000" ? "Guest" : "User");
                const isStreamer = msg.user_id === stream?.user_id;

                return (
                  <div key={msg.id} className="py-0.5 px-1.5 -mx-1.5 rounded hover:bg-secondary/40 transition-colors text-sm break-words">
                    {isStreamer && (
                      <Badge variant="secondary" className="mr-1 px-1 py-0 text-[10px] font-bold bg-primary/20 text-primary border-0 align-middle">
                        STREAMER
                      </Badge>
                    )}
                    {tier && !isStreamer && <Crown className="w-3 h-3 inline-block mr-0.5 text-primary align-middle" />}
                    <span className={`font-semibold ${isStreamer ? "text-primary" : nameColors[colorIndex]}`}>{displayName}</span>
                    <span className="text-muted-foreground mx-0.5">:</span>
                    <span className="text-foreground">{msg.message}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Gifts */}
          {stream?.user_id && user && (
            <div className="px-3 pb-1">
              <StreamGifts
                streamId={stream.id}
                recipientId={stream.user_id}
                onGiftSent={(gift) => {
                  setHighlightedTips(prev => [...prev, {
                    id: crypto.randomUUID(),
                    senderName: gift.senderName,
                    giftName: gift.giftName,
                    giftIcon: gift.giftIcon,
                    amount: gift.amount,
                    message: gift.message,
                  }]);
                }}
              />
            </div>
          )}

          {/* Chat input */}
          <div className="p-2.5 border-t border-border bg-card">
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Send a message"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-9 bg-secondary/50 border-border/50 text-sm h-8"
                  maxLength={500}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <EmojiPicker onEmojiSelect={(emoji) => setChatMessage(prev => prev + emoji)} />
                </div>
              </div>
              <Button variant="default" size="sm" className="h-8 px-3" onClick={handleSendMessage} disabled={!chatMessage.trim() || sendMessage.isPending}>
                {sendMessage.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="text-xs font-semibold">Chat</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamView;
