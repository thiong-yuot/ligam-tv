import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import HLSVideoPlayer from "@/components/HLSVideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages, useSendMessage } from "@/hooks/useChat";
import { useStreams } from "@/hooks/useStreams";
import { useCheckStreamAccess, useCreateStreamCheckout } from "@/hooks/useStreamAccess";
import StreamGifts from "@/components/stream/StreamGifts";
import TipDialog from "@/components/TipDialog";
import { Heart, Users, Send, Lock, Gift, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const StreamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stream, isLoading: streamLoading } = useStreams(id);
  const { data: accessData, isLoading: accessLoading } = useCheckStreamAccess(id);
  const createCheckout = useCreateStreamCheckout();
  const messages = useChatMessages(id);
  const sendMessageMutation = useSendMessage();
  const [newMessage, setNewMessage] = useState("");
  const [showTipDialog, setShowTipDialog] = useState(false);

  const hasAccess = accessData?.hasAccess ?? false;

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user) {
      toast.error("Please sign in to chat");
      return;
    }
    await sendMessageMutation.mutateAsync({ streamId: id, message: newMessage });
    setNewMessage("");
  };

  const handlePurchaseAccess = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const result = await createCheckout.mutateAsync(id);
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Failed to start checkout");
    }
  };

  if (streamLoading || accessLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading stream...</div>
        </div>
      </Layout>
    );
  }

  if (!stream) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Stream Not Found</h1>
          <Button onClick={() => navigate("/browse")}>Browse Streams</Button>
        </div>
      </Layout>
    );
  }

  const isPaidStream = stream.is_paid && stream.access_price > 0;
  const canWatch = !isPaidStream || hasAccess || stream.user_id === user?.id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {canWatch ? (
                stream.hls_url ? (
                  <HLSVideoPlayer src={stream.hls_url} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Stream not available
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">Premium Content</h3>
                  <p className="text-muted-foreground max-w-md">
                    This is a paid stream. Purchase access to watch.
                  </p>
                  <Button onClick={handlePurchaseAccess} size="lg">
                    Purchase Access - ${stream.access_price}
                  </Button>
                </div>
              )}
            </div>

            {/* Stream Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{stream.title}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {stream.viewer_count || 0} viewers
                    </span>
                    {stream.is_live && (
                      <Badge variant="destructive">LIVE</Badge>
                    )}
                    {isPaidStream && (
                      <Badge variant="secondary">${stream.access_price}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowTipDialog(true)}>
                    <Gift className="h-4 w-4 mr-2" />
                    Tip
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {stream.description && (
                <p className="text-muted-foreground">{stream.description}</p>
              )}
            </div>

            {/* Gifts Section */}
            {canWatch && <StreamGifts streamId={id} streamerId={stream.user_id} />}
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Live Chat
                </h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages?.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {msg.user_id?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder={user ? "Send a message..." : "Sign in to chat"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={!user}
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!user}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <TipDialog
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        recipientId={stream.user_id}
        streamId={id}
      />
    </Layout>
  );
};

export default StreamView;
