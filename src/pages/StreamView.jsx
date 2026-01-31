import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages, useSendMessage } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import HLSVideoPlayer from "@/components/HLSVideoPlayer";
import TipDialog from "@/components/TipDialog";
import StreamGifts from "@/components/stream/StreamGifts";
import StreamerServices from "@/components/stream/StreamerServices";
import { Heart, Share2, Users, Send, Crown, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StreamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [stream, setStream] = useState(null);
  const [streamer, setStreamer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [tipDialogOpen, setTipDialogOpen] = useState(false);

  const messages = useChatMessages(id);
  const { mutate: sendMessageMutation } = useSendMessage();

  useEffect(() => {
    const fetchStream = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching stream:", error);
        setLoading(false);
        return;
      }

      setStream(data);

      // Fetch streamer profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user_id)
        .single();

      setStreamer(profile);
      setLoading(false);
    };

    fetchStream();
  }, [id]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!stream || !user) {
        setCheckingAccess(false);
        // Free streams are accessible to everyone
        if (stream && !stream.is_paid) {
          setHasAccess(true);
        }
        return;
      }

      // Owner always has access
      if (stream.user_id === user.id) {
        setHasAccess(true);
        setCheckingAccess(false);
        return;
      }

      // Free streams are accessible
      if (!stream.is_paid) {
        setHasAccess(true);
        setCheckingAccess(false);
        return;
      }

      // Check if user has purchased access
      const { data } = await supabase
        .from("stream_access")
        .select("*")
        .eq("stream_id", id)
        .eq("user_id", user.id)
        .single();

      setHasAccess(!!data);
      setCheckingAccess(false);
    };

    checkAccess();
  }, [stream, user, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    sendMessageMutation({ streamId: id, message: newMessage });
    setNewMessage("");
  };

  const handlePurchaseAccess = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-stream-checkout", {
        body: { streamId: id },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  if (loading || checkingAccess) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!stream) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Stream not found</h1>
          <Button onClick={() => navigate("/browse")}>Browse Streams</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {hasAccess ? (
                stream.hls_url || stream.mux_playback_id ? (
                  <HLSVideoPlayer
                    src={stream.hls_url || `https://stream.mux.com/${stream.mux_playback_id}.m3u8`}
                    autoPlay
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Stream is offline
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-background/50 to-background p-8 text-center">
                  <Lock className="h-16 w-16 mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">Premium Stream</h2>
                  <p className="text-muted-foreground mb-6">
                    Get access to this exclusive stream for ${stream.access_price}
                  </p>
                  <Button onClick={handlePurchaseAccess} size="lg">
                    <Crown className="mr-2 h-5 w-5" />
                    Purchase Access
                  </Button>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={streamer?.avatar_url} />
                      <AvatarFallback>
                        {streamer?.display_name?.[0] || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-xl font-bold">{stream.title}</h1>
                      <p className="text-muted-foreground">
                        {streamer?.display_name || "Streamer"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {stream.is_live && (
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      <Users className="h-3 w-3 mr-1" />
                      {stream.viewer_count || 0}
                    </Badge>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground">{stream.description}</p>

                <div className="flex items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTipDialogOpen(true)}
                    disabled={!user}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Tip
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gifts */}
            {hasAccess && <StreamGifts streamId={id} streamerId={stream.user_id} />}

            {/* Streamer's Services */}
            <StreamerServices 
              streamerId={stream.user_id} 
              streamerUsername={streamer?.username}
            />
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Live Chat</h2>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {msg.user_id?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          User
                        </span>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={user ? "Send a message..." : "Login to chat"}
                    disabled={!user}
                  />
                  <Button type="submit" size="icon" disabled={!user}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <TipDialog
        open={tipDialogOpen}
        onOpenChange={setTipDialogOpen}
        recipientId={stream.user_id}
        recipientName={streamer?.display_name || "Streamer"}
      />
    </Layout>
  );
};

export default StreamView;
