import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Users, 
  Settings, 
  Send,
  Smile,
  Gift,
  Volume2,
  Maximize,
  Play,
  Pause,
  Loader2
} from "lucide-react";
import { useStream } from "@/hooks/useStreams";
import { useChat } from "@/hooks/useChat";

const StreamView = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);

  const { data: stream, isLoading } = useStream(id || "");
  const { messages } = useChat(id || "");

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
          <div className="relative aspect-video bg-ligam-dark group">
            {stream.thumbnail_url ? (
              <img
                src={stream.thumbnail_url}
                alt={stream.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Play className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            
            {/* Player Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {stream.is_live && (
                  <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded flex items-center gap-1">
                    <span className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse-live" />
                    LIVE
                  </span>
                )}
                <span className="px-2 py-1 bg-background/80 text-foreground text-xs font-medium rounded flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatViewers(stream.viewer_count || 0)}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-foreground hover:bg-foreground/20"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-foreground/20">
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-foreground/20">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-foreground/20">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

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

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 border-l border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Stream Chat</h3>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] lg:min-h-0">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Be the first to say something!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex gap-2 text-sm animate-slideIn">
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
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Gift className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button variant="default" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamView;