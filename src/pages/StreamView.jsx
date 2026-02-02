import React, { useState, useCallback, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HLSVideoPlayer from "@/components/HLSVideoPlayer";
import HighlightedTip from "@/components/HighlightedTip";
import StreamGifts from "@/components/stream/StreamGifts";
import TipDialog from "@/components/TipDialog";
import FeaturedProductsWidget from "@/components/channel/FeaturedProductsWidget";
import FeaturedGigsWidget from "@/components/channel/FeaturedGigsWidget";
import FeaturedCoursesWidget from "@/components/channel/FeaturedCoursesWidget";
import SubscribeWidget from "@/components/channel/SubscribeWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  ChevronUp
} from "lucide-react";
import { useStream } from "@/hooks/useStreams";
import { useChatMessages, useSendMessage } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useProducts } from "@/hooks/useProducts";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { useCourses } from "@/hooks/useCourses";
import { useCheckStreamAccess, useCreateStreamCheckout, useVerifyStreamAccess } from "@/hooks/useStreamAccess";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const StreamView = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [highlightedTips, setHighlightedTips] = useState([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { user } = useAuth();
  const { tier, createSubscriptionCheckout } = useSubscription();
  const { data: stream, isLoading } = useStream(id || "");
  const { data: accessInfo, isLoading: accessLoading, refetch: refetchAccess } = useCheckStreamAccess(id || "");
  const messages = useChatMessages(id || "");
  const sendMessage = useSendMessage();
  const { data: allProducts = [] } = useProducts();
  const { data: allCourses = [] } = useCourses();
  const createStreamCheckout = useCreateStreamCheckout();
  const verifyStreamAccess = useVerifyStreamAccess();

  // Verify payment on return from Stripe
  useEffect(() => {
    const accessParam = searchParams.get('access');
    const sessionId = searchParams.get('session_id');
    
    if (accessParam === 'granted' && sessionId && id) {
      verifyStreamAccess.mutate({ sessionId, streamId: id }, {
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

  // Use Mux HLS URL from stream data or construct from playback ID
  const hlsUrl = stream?.hls_url || (stream?.mux_playback_id 
    ? `https://stream.mux.com/${stream.mux_playback_id}.m3u8`
    : null);

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
      const result = await createStreamCheckout.mutateAsync(id);
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
    if (!chatMessage.trim() || !id || !user) {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to chat",
          variant: "destructive",
        });
      }
      return;
    }

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

  const formatViewers = (count) => {
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
        <div className="pt-24 text-center px-4">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">Stream Not Found</h1>
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-4 md:p-6 text-center bg-card/95 border-primary/20">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <Badge className="bg-primary text-primary-foreground border-0 mb-3 md:mb-4">
            <Crown className="w-3 h-3 mr-1" />
            Premium Stream
          </Badge>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-2 line-clamp-2">{stream.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This is a paid live stream. Purchase access to watch the full content.
          </p>
          
          {accessInfo?.previewUrl && (
            <div className="mb-4 p-2 md:p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Play className="w-4 h-4" />
                <span>Free preview available above</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold text-foreground">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary" />
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

  // Sidebar content shared between desktop and mobile
  const SidebarContent = ({ inSheet = false }) => (
    <Tabs defaultValue="chat" className="flex flex-col h-full">
      <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 shrink-0">
        <TabsTrigger 
          value="chat" 
          className="flex-1 gap-1 md:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-xs md:text-sm py-2 md:py-3"
        >
          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden xs:inline">Chat</span>
        </TabsTrigger>
        <TabsTrigger 
          value="shop" 
          className="flex-1 gap-1 md:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-xs md:text-sm py-2 md:py-3"
        >
          <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden xs:inline">Shop</span>
        </TabsTrigger>
        <TabsTrigger 
          value="services" 
          className="flex-1 gap-1 md:gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-xs md:text-sm py-2 md:py-3"
        >
          <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden xs:inline">Services</span>
        </TabsTrigger>
      </TabsList>

      {/* Chat Tab */}
      <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-3 md:p-4 space-y-3 ${inSheet ? 'min-h-[200px] max-h-[40vh]' : 'min-h-[200px] lg:min-h-0'}`}>
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
            <div className="text-center text-muted-foreground py-6 md:py-8">
              <MessageCircle className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-2 text-sm animate-slideIn">
                {tier && (
                  <Crown className={`w-4 h-4 flex-shrink-0 ${
                    tier === 'pro' ? 'text-amber-500' : 'text-primary'
                  }`} />
                )}
                <span className="font-semibold text-primary">
                  User:
                </span>
                <span className="text-foreground">{msg.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Gifts Panel */}
        {stream?.user_id && (
          <div className="px-3 md:px-4 pb-2">
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

        <div className="p-3 md:p-4 border-t border-border">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={user ? "Send a message" : "Login to chat"}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-10 bg-secondary text-sm"
                disabled={!user}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon" className="h-6 w-6 md:h-7 md:w-7">
                  <Smile className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
            <Button 
              variant="default" 
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10"
              onClick={handleSendMessage}
              disabled={!chatMessage.trim() || !user || sendMessage.isPending}
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Shop Tab */}
      <TabsContent value="shop" className={`flex-1 overflow-y-auto p-3 md:p-4 m-0 space-y-4 ${inSheet ? 'max-h-[50vh]' : ''}`}>
        <SubscribeWidget
          creatorName="Streamer"
          currentTier={tier}
          onSubscribe={(tierKey) => {
            const priceId = SUBSCRIPTION_TIERS[tierKey].price_id;
            if (priceId) createSubscriptionCheckout(priceId);
          }}
        />
        
        {streamerProducts.length > 0 && (
          <FeaturedProductsWidget
            products={streamerProducts}
            maxItems={4}
          />
        )}
        
        {streamerProducts.length === 0 && (
          <div className="text-center py-6 md:py-8 text-muted-foreground">
            <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No products available</p>
          </div>
        )}
      </TabsContent>

      {/* Services Tab (Gigs + Courses) */}
      <TabsContent value="services" className={`flex-1 overflow-y-auto p-3 md:p-4 m-0 space-y-4 ${inSheet ? 'max-h-[50vh]' : ''}`}>
        {streamerFreelancer && streamerPackages.length > 0 && (
          <FeaturedGigsWidget
            freelancer={streamerFreelancer}
            packages={streamerPackages}
            maxItems={3}
          />
        )}
        
        {stream?.user_id && (
          <FeaturedCoursesWidget
            creatorId={stream.user_id}
          />
        )}
        
        {(!streamerFreelancer || streamerPackages.length === 0) && streamerCourses.length === 0 && (
          <div className="text-center py-6 md:py-8 text-muted-foreground">
            <Briefcase className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No services available</p>
            <p className="text-xs">This streamer hasn't set up any gigs or courses yet</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player or Paywall */}
          {isPaidStream && !hasAccess ? (
            <PaidStreamPaywall />
          ) : stream.is_live && hlsUrl ? (
            <HLSVideoPlayer
              src={hlsUrl}
              poster={stream.thumbnail_url || undefined}
              isLive={stream.is_live}
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
                <div className="text-center px-4">
                  <Users className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-3 md:mb-4" />
                  <p className="text-base md:text-lg font-medium text-foreground">Stream Offline</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Check back later when the streamer is live</p>
                </div>
              )}
            </div>
          )}

          {/* Stream Info */}
          <div className="p-3 md:p-4 lg:p-6 border-b border-border">
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Streamer info row */}
              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full ring-2 ring-primary bg-secondary overflow-hidden flex-shrink-0">
                  {stream.profiles?.avatar_url ? (
                    <img 
                      src={stream.profiles.avatar_url} 
                      alt={stream.profiles.display_name || "Streamer"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-4 h-4 md:w-6 md:h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <h1 className="text-base md:text-xl font-display font-bold text-foreground line-clamp-2">
                      {stream.title}
                    </h1>
                    {isPaidStream && (
                      <Badge className="bg-primary text-primary-foreground border-0 text-xs shrink-0">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${streamPrice}
                      </Badge>
                    )}
                    {hasAccess && isPaidStream && (
                      <Badge variant="secondary" className="border-green-500/50 text-green-500 text-xs shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Access Granted
                      </Badge>
                    )}
                  </div>
                  <p className="text-primary font-semibold text-sm md:text-base">
                    {stream.profiles?.display_name || stream.profiles?.username || "Streamer"}
                    {stream.profiles?.is_verified && (
                      <Badge variant="secondary" className="ml-2 text-xs">Verified</Badge>
                    )}
                  </p>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                    <span>{formatViewers(stream.viewer_count || 0)} viewers</span>
                    {stream.profiles?.follower_count && (
                      <span className="hidden sm:inline">{formatViewers(stream.profiles.follower_count)} followers</span>
                    )}
                  </div>
                  {stream.tags && stream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                      {stream.tags.slice(0, isMobile ? 3 : stream.tags.length).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 md:px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {isMobile && stream.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 text-muted-foreground text-xs">
                          +{stream.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons row */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  onClick={() => setIsFollowing(!isFollowing)}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isFollowing ? "fill-current" : ""}`} />
                  <span className="hidden xs:inline ml-1">{isFollowing ? "Following" : "Follow"}</span>
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
                
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  <Crown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden xs:inline ml-1">Subscribe</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
                  <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 md:p-4 lg:p-6">
            <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">About this stream</h3>
            <p className="text-muted-foreground text-sm">{stream.description || "No description provided."}</p>
          </div>

          {/* Mobile Sidebar Sheet Trigger - Fixed at bottom on mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card p-2">
            <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="secondary" className="w-full gap-2">
                  <ChevronUp className="w-4 h-4" />
                  <MessageCircle className="w-4 h-4" />
                  Chat & Shop
                  {messages.length > 0 && (
                    <Badge variant="default" className="ml-1 h-5 min-w-5 text-xs">
                      {messages.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] p-0 rounded-t-xl">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <SidebarContent inSheet={true} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Add padding at bottom on mobile to account for fixed button */}
          <div className="lg:hidden h-16" />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 xl:w-96 border-l border-border flex-col bg-card">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default StreamView;
