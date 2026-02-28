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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Users, 
  Send,
  Smile,
  Gift,
  Loader2,
  Crown,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Lock,
  Play,
  DollarSign,
  CheckCircle,
  Coins,
  Maximize,
  Minimize
} from "lucide-react";
import EmojiPicker from "@/components/stream/EmojiPicker";
import { useStream } from "@/hooks/useStreams";
import { useChatMessages, useSendMessage } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useProducts } from "@/hooks/useProducts";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { useCourses } from "@/hooks/useCourses";
import { useCheckStreamAccess, useCreateStreamCheckout, useVerifyStreamAccess } from "@/hooks/useStreamAccess";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/hooks/useFollowers";
import { useQuery } from "@tanstack/react-query";
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
  const [activeTab, setActiveTab] = useState("chat");
  const { user } = useAuth();
  const { tier } = useSubscription();
  const { data: stream, isLoading } = useStream(id || "");
  const streamId = stream?.id || "";
  const { data: accessInfo, isLoading: accessLoading, refetch: refetchAccess } = useCheckStreamAccess(streamId);
  const messages = useChatMessages(streamId);
  const sendMessage = useSendMessage();
  const { data: allProducts = [] } = useProducts();
  const { data: allCourses = [] } = useCourses();
  const createStreamCheckout = useCreateStreamCheckout();
  const verifyStreamAccess = useVerifyStreamAccess();

  // Follow state from DB
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
      try {
        await navigator.share({ title: stream?.title || "Stream", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Stream link copied to clipboard" });
    }
  };

  // Verify payment on return from Stripe
  useEffect(() => {
    const accessParam = searchParams.get('access');
    const sessionId = searchParams.get('session_id');
    
    if (accessParam === 'granted' && sessionId && streamId) {
      verifyStreamAccess.mutate({ sessionId, streamId }, {
        onSuccess: () => {
          toast({
            title: "Access Granted!",
            description: "You now have access to this stream.",
          });
          refetchAccess();
        },
        onError: (error) => {
          toast({
            title: "Verification Error",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  }, [searchParams, id]);

  // Fetch streamer's freelancer profile and packages
  const { data: streamerFreelancer } = useQuery({
    queryKey: ["freelancer-by-user", stream?.user_id],
    queryFn: async () => {
      if (!stream?.user_id) return null;
      const { data } = await supabase
        .from("freelancers")
        .select("*")
        .eq("user_id", stream.user_id)
        .maybeSingle();
      return data;
    },
    enabled: !!stream?.user_id,
  });

  const { data: streamerPackages = [] } = useQuery({
    queryKey: ["freelancer-packages", streamerFreelancer?.id],
    queryFn: async () => {
      if (!streamerFreelancer?.id) return [];
      const { data } = await supabase
        .from("freelancer_packages")
        .select("*")
        .eq("freelancer_id", streamerFreelancer.id)
        .order("price");
      return data || [];
    },
    enabled: !!streamerFreelancer?.id,
  });

  // Filter products and courses by streamer
  const streamerProducts = allProducts.filter(p => p.seller_id === stream?.user_id);
  const streamerCourses = allCourses.filter(c => c.creator_id === stream?.user_id);

  // Use SRS HLS URL from stream data
  const hlsUrl = stream?.hls_url || null;

  const handleViewerJoin = useCallback(async () => {
    if (stream?.id) {
      await supabase.functions.invoke("rtmp-webhook", {
        body: { action: "on_play", stream_id: stream.id },
      });
    }
  }, [stream?.id]);

  const handleViewerLeave = useCallback(async () => {
    if (stream?.id) {
      await supabase.functions.invoke("rtmp-webhook", {
        body: { action: "on_play_done", stream_id: stream.id },
      });
    }
  }, [stream?.id]);

  const handlePurchaseAccess = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase stream access",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createStreamCheckout.mutateAsync(id!);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create checkout",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !id) return;

    try {
      await sendMessage.mutateAsync({ streamId: id, message: chatMessage });
      setChatMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
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
          <Link to="/browse">
            <Button>Browse Streams</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPaidStream = accessInfo?.isPaid;
  const hasAccess = accessInfo?.hasAccess;
  const streamPrice = accessInfo?.price || 0;

  // Paid Stream Paywall Component
  const PaidStreamPaywall = () => (
    <div className="relative aspect-video bg-secondary flex items-center justify-center">
      {/* Preview Video or Thumbnail */}
      {accessInfo?.previewUrl ? (
        <video
          src={accessInfo.previewUrl}
          poster={stream.thumbnail_url || undefined}
          controls
          className="w-full h-full object-cover absolute inset-0"
        />
      ) : stream.thumbnail_url ? (
        <img
          src={stream.thumbnail_url}
          alt={stream.title}
          className="w-full h-full object-cover absolute inset-0 opacity-30"
        />
      ) : null}
      
      {/* Paywall Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <Card className="max-w-md mx-4 p-6 text-center bg-card/95 border-primary/20">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <Badge className="bg-primary text-primary-foreground border-0 mb-4">
            <Crown className="w-3 h-3 mr-1" />
            Premium Stream
          </Badge>
          <h2 className="text-xl font-bold text-foreground mb-2">{stream.title}</h2>
          <p className="text-muted-foreground mb-4">
            This is a paid live stream. Purchase access to watch the full content.
          </p>
          
          {accessInfo?.previewUrl && (
            <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Play className="w-4 h-4" />
                <span>Free preview available above</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
              <DollarSign className="w-6 h-6 text-primary" />
              <span>{streamPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">One-time payment • Lifetime access</p>
            
            <Button 
              onClick={handlePurchaseAccess}
              disabled={createStreamCheckout.isPending}
              className="w-full"
              size="lg"
            >
              {createStreamCheckout.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Crown className="w-4 h-4 mr-2" />
              )}
              Purchase Access
            </Button>
            
            {!user && (
              <p className="text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">Login</Link> to purchase
              </p>
            )}
          </div>
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
          {/* Video Player or Paywall */}
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
                  <img
                    src={stream.thumbnail_url}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground">Stream Offline</p>
                    <p className="text-sm text-muted-foreground">Check back later when the streamer is live</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stream Info */}
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full ring-2 ring-primary bg-secondary overflow-hidden flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">
                    {(stream.profiles?.display_name || stream.profiles?.username || "S").charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-xl font-display font-bold text-foreground">
                      {stream.title}
                    </h1>
                    {isPaidStream && (
                      <Badge className="bg-primary text-primary-foreground border-0">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${streamPrice}
                      </Badge>
                    )}
                    {hasAccess && isPaidStream && (
                      <Badge variant="secondary" className="border-green-500/50 text-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Access Granted
                      </Badge>
                    )}
                  </div>
                  <p className="text-primary font-semibold">
                    {stream.profiles?.display_name || stream.profiles?.username || "Streamer"}
                    {stream.profiles?.is_verified && (
                      <Badge variant="secondary" className="ml-2 text-xs">Verified</Badge>
                    )}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatViewers(stream.viewer_count || 0)} viewers</span>
                    {stream.profiles?.follower_count && (
                      <span>{formatViewers(stream.profiles.follower_count)} followers</span>
                    )}
                  </div>
                  {stream.tags && stream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stream.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  onClick={handleToggleFollow}
                  disabled={followUser.isPending || unfollowUser.isPending}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`} />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                
                {/* Tip/Donate Button */}
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
                
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 md:p-6">
            <h3 className="font-semibold text-foreground mb-2">About this stream</h3>
            <p className="text-muted-foreground">{stream.description || "No description provided."}</p>
          </div>
        </div>

        {/* Sidebar with Tabs */}
        <div className="w-full lg:w-96 border-l border-border flex flex-col bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className={cn("flex flex-col", activeTab === "chat" && "h-full")}>
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
              <TabsTrigger 
                value="chat" 
                className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="shop" 
                className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop
              </TabsTrigger>
              <TabsTrigger 
                value="services" 
                className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Briefcase className="w-4 h-4" />
                Services
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab — Twitch-style live chat */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live Chat
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>{formatViewers(stream.viewer_count || 0)}</span>
                </div>
              </div>

              {/* Messages area */}
              <div
                className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 min-h-[300px] lg:min-h-0 scroll-smooth"
                ref={(el) => {
                  if (el) el.scrollTop = el.scrollHeight;
                }}
              >
                {/* Highlighted Tips */}
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
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Welcome to the chat!</p>
                    <p className="text-xs">Say something to get the conversation started.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const nameColors = [
                      "text-red-400", "text-blue-400", "text-green-400",
                      "text-yellow-400", "text-pink-400", "text-purple-400",
                      "text-orange-400", "text-teal-400", "text-cyan-400",
                      "text-emerald-400", "text-rose-400", "text-indigo-400",
                    ];
                    const colorIndex = msg.user_id
                      ? msg.user_id.charCodeAt(0) % nameColors.length
                      : 0;
                    const displayName =
                      msg.profiles?.display_name ||
                      msg.profiles?.username ||
                      (msg.user_id === "00000000-0000-0000-0000-000000000000"
                        ? "Guest"
                        : "User");
                    const isStreamer = msg.user_id === stream?.user_id;

                    return (
                      <div
                        key={msg.id}
                        className="py-1 px-2 -mx-2 rounded hover:bg-secondary/40 transition-colors leading-relaxed text-sm break-words animate-slideIn"
                      >
                        {isStreamer && (
                          <Badge
                            variant="secondary"
                            className="mr-1.5 px-1 py-0 text-[10px] font-bold bg-primary/20 text-primary border-0 align-middle"
                          >
                            STREAMER
                          </Badge>
                        )}
                        {tier && !isStreamer && (
                          <Crown className="w-3.5 h-3.5 inline-block mr-1 text-primary align-middle" />
                        )}
                        <span className={`font-semibold ${isStreamer ? "text-primary" : nameColors[colorIndex]} cursor-pointer hover:underline`}>
                          {displayName}
                        </span>
                        <span className="text-muted-foreground mx-1">:</span>
                        <span className="text-foreground">{msg.message}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Gifts Panel */}
              {stream?.user_id && user && (
                <div className="px-4 pb-2">
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
              <div className="p-3 border-t border-border bg-card">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Send a message"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      className="pr-10 bg-secondary/50 border-border/50 text-sm h-9"
                      maxLength={500}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <EmojiPicker onEmojiSelect={(emoji) => setChatMessage(prev => prev + emoji)} />
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-9 px-3"
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || sendMessage.isPending}
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-xs font-semibold">Chat</span>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Shop Tab */}
            <TabsContent value="shop" className="overflow-y-auto p-3 m-0 space-y-2 [&[data-state=active]]:flex-none">
              {streamerProducts.length > 0 ? (
                <div className="space-y-2">
                  {streamerProducts.slice(0, 4).map((product) => (
                    <Link key={product.id} to={`/shop?seller=${stream.user_id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-muted-foreground" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-primary font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  <p className="text-sm">No products available</p>
                </div>
              )}
            </TabsContent>

            {/* Services Tab (Gigs + Courses) */}
            <TabsContent value="services" className="overflow-y-auto p-3 m-0 space-y-3 [&[data-state=active]]:flex-none">
              {streamerFreelancer && streamerPackages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium">Gigs</span>
                  </div>
                  {streamerPackages.slice(0, 3).map((pkg) => (
                    <Link key={pkg.id} to={`/freelance/${stream?.profiles?.username || streamerFreelancer.id}`} className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                          <p className="text-xs text-muted-foreground">{pkg.delivery_days} day{pkg.delivery_days > 1 ? 's' : ''} delivery</p>
                        </div>
                        <span className="text-sm font-bold text-primary">${pkg.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {streamerCourses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium">Courses</span>
                  </div>
                  {streamerCourses.slice(0, 3).map((course) => (
                    <Link key={course.id} to={`/courses/${(course as any).slug || course.id}`} className="flex items-center gap-3 p-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="w-12 h-9 rounded overflow-hidden flex-shrink-0 bg-muted">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                        <p className="text-xs text-primary font-bold">{course.price === 0 ? "Free" : `$${course.price}`}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              {(!streamerFreelancer || streamerPackages.length === 0) && streamerCourses.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Briefcase className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  <p className="text-sm">No services available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StreamView;
