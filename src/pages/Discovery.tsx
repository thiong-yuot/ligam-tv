import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  Newspaper, 
  Video, 
  TrendingUp, 
  Search,
  Play,
  Clock,
  Eye
} from "lucide-react";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string };

const Discovery = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/eelai-chat`;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error || "Failed to connect to Eelai");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat([...messages, userMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedTopics = [
    { icon: TrendingUp, label: "Trending News", query: "What are the top trending news stories today?" },
    { icon: Sparkles, label: "Tech Updates", query: "What's new in technology and AI?" },
    { icon: Video, label: "Entertainment", query: "What's trending in entertainment right now?" },
    { icon: Newspaper, label: "World News", query: "Give me a summary of major world events" },
  ];

  const featuredVideos = [
    { title: "Daily Tech Briefing", duration: "5 min", views: "12.5K", thumbnail: "📱" },
    { title: "World News Roundup", duration: "8 min", views: "8.2K", thumbnail: "🌍" },
    { title: "Entertainment Spotlight", duration: "6 min", views: "15.1K", thumbnail: "🎬" },
    { title: "Sports Highlights", duration: "4 min", views: "20.3K", thumbnail: "⚽" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your AI Companion</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Let's discover what's new
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ask Eelai anything - get up-to-date information, news, and discover content
            </p>
          </div>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="chat" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="news" className="gap-2">
                <Newspaper className="w-4 h-4" />
                News
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="w-4 h-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-6">
              {messages.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {suggestedTopics.map((topic, i) => (
                    <Card
                      key={i}
                      className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                      onClick={() => {
                        setInput(topic.query);
                        setTimeout(() => handleSend(), 100);
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                          <topic.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{topic.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "assistant" && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                                EE
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                              EE
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted/50 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                </Card>
              )}

              {/* Chat Input */}
              <Card className="p-4 bg-card/80 backdrop-blur border-border/50">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Ask Eelai anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      className="pl-10 h-12 bg-secondary/50 border-0"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="h-12 px-6 bg-gradient-to-r from-primary to-accent"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl">
                    🌍
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">Breaking</Badge>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      Ask Eelai about today's top stories
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized news summaries and analysis
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {["Technology", "Entertainment", "Sports", "Business"].map((category, i) => (
                    <Card
                      key={i}
                      className="p-4 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-all"
                      onClick={() => {
                        setInput(`What's the latest news in ${category}?`);
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                        {["💻", "🎬", "⚽", "📈"][i]}
                      </div>
                      <div>
                        <h4 className="font-medium">{category}</h4>
                        <p className="text-sm text-muted-foreground">
                          Latest updates and analysis
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredVideos.map((video, i) => (
                  <Card key={i} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                    <div className="aspect-video bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center text-5xl relative">
                      {video.thumbnail}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {video.views}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Short Videos Coming Soon</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  We're building a video discovery experience. Upload and watch short-form content soon!
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Discovery;
