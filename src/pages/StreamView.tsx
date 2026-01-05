import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HLSVideoPlayer from "@/components/HLSVideoPlayer";
import TipDialog from "@/components/TipDialog";
import HighlightedTip from "@/components/HighlightedTip";
import FeaturedProductsWidget from "@/components/channel/FeaturedProductsWidget";
import FeaturedGigsWidget from "@/components/channel/FeaturedGigsWidget";
import SubscribeWidget from "@/components/channel/SubscribeWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Users, 
  Settings, 
  Send,
  Smile,
  Gift,
  Loader2,
  Crown,
  ShoppingBag,
  Briefcase
} from "lucide-react";
import { useStream } from "@/hooks/useStreams";
import { useChatMessages } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";
import { useProducts } from "@/hooks/useProducts";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { useQuery } from "@tanstack/react-query";

const StreamView = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [highlightedTips, setHighlightedTips] = useState<Array<{
    id: string;
    senderName: string;
    giftName: string;
    giftIcon: string;
    amount: number;
    message?: string;
  }>>([]);

  const { user } = useAuth();
  const { tier, createSubscriptionCheckout } = useSubscription();
  const { data: stream, isLoading } = useStream(id || "");
  const messages = useChatMessages(id || "");
  const { data: allProducts = [] } = useProducts();

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

  // Filter products by streamer
  const streamerProducts = allProducts.filter(p => p.seller_id === stream?.user_id);

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

  const formatViewers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          {stream.is_live && hlsUrl ? (
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
                <div className="text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground">Stream Offline</p>
                  <p className="text-sm text-muted-foreground">Check back later when the streamer is live</p>
                </div>
              )}
            </div>
          )}

          {/* Stream Info */}
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full ring-2 ring-primary bg-secondary flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-foreground mb-1">
                    {stream.title}
                  </h1>
                  <p className="text-primary font-semibold">
                    Streamer
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatViewers(stream.viewer_count || 0)} viewers
                  </p>
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
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`} />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">
                  <Gift className="w-4 h-4" />
                  Subscribe
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-4 h-4" />
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
          <Tabs defaultValue="chat" className="flex flex-col h-full">
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
                value="gigs" 
                className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Briefcase className="w-4 h-4" />
                Gigs
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] lg:min-h-0">
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

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Send a message"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="pr-16 bg-secondary"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Smile className="w-4 h-4" />
                      </Button>
                      {stream?.user_id && (
                        <TipDialog
                          streamId={stream.id}
                          recipientId={stream.user_id}
                          onTipSent={(tip) => {
                            setHighlightedTips(prev => [...prev, {
                              id: crypto.randomUUID(),
                              senderName: user?.email?.split('@')[0] || 'Anonymous',
                              giftName: tip.giftName,
                              giftIcon: tip.giftName.toLowerCase(),
                              amount: tip.amount,
                              message: tip.message,
                            }]);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <Button variant="default" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Shop Tab */}
            <TabsContent value="shop" className="flex-1 overflow-y-auto p-4 m-0 space-y-4">
              <SubscribeWidget
                creatorName="Streamer"
                currentTier={tier}
                onSubscribe={(tierKey) => {
                  const priceId = SUBSCRIPTION_TIERS[tierKey].price_id;
                  createSubscriptionCheckout(priceId);
                }}
              />
              
              {streamerProducts.length > 0 && (
                <FeaturedProductsWidget
                  products={streamerProducts}
                  maxItems={4}
                />
              )}
              
              {streamerProducts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No products available</p>
                </div>
              )}
            </TabsContent>

            {/* Gigs Tab */}
            <TabsContent value="gigs" className="flex-1 overflow-y-auto p-4 m-0 space-y-4">
              {streamerFreelancer && streamerPackages.length > 0 ? (
                <FeaturedGigsWidget
                  freelancer={streamerFreelancer}
                  packages={streamerPackages}
                  maxItems={4}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No gigs available</p>
                  <p className="text-xs">This streamer hasn't set up any services yet</p>
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