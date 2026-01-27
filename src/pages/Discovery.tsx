import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  Play,
  Eye,
  ChevronDown,
  Mic,
  Plus,
  Loader2,
  Home,
  Film,
  Cloud,
  MapPin,
  Newspaper,
  MessageCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useDiscoveryContent, useFeaturedContent } from "@/hooks/useDiscoveryContent";
import { useWeather } from "@/hooks/useWeather";
import { useEelaiNews, NewsItem } from "@/hooks/useEelaiNews";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };
type ActiveTab = "home" | "news" | "weather" | "chat";

const Discovery = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsCategory, setNewsCategory] = useState("world");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { data: allContent } = useDiscoveryContent();
  const { data: featuredContent } = useFeaturedContent();
  const { weather, isLoading: weatherLoading } = useWeather();
  const { searchNews, isLoading: newsLoading } = useEelaiNews();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load news when switching to news tab
  useEffect(() => {
    if (activeTab === "news" && newsItems.length === 0) {
      loadNews();
    }
  }, [activeTab]);

  const loadNews = async (category?: string) => {
    const cat = category || newsCategory;
    const items = await searchNews(undefined, cat);
    setNewsItems(items);
  };

  const resetToHome = () => {
    setMessages([]);
    setInput("");
    setActiveTab("home");
  };

  const askAboutContent = async (topic: string) => {
    setActiveTab("chat");
    const userMsg: Message = { role: "user", content: topic };
    setMessages([userMsg]);
    setIsLoading(true);

    try {
      await streamChat([userMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

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
      if (resp.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (resp.status === 402) {
        throw new Error("Service temporarily unavailable.");
      }
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

    if (activeTab !== "chat") {
      setActiveTab("chat");
    }

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

  const featuredNews = featuredContent?.find(c => c.content_type === 'news');
  const dailyBriefing = featuredContent?.find(c => c.content_type === 'daily_briefing') || allContent?.find(c => c.content_type === 'daily_briefing');
  const videoItems = allContent?.filter(c => c.content_type === 'video' || c.content_type === 'daily_briefing') || [];
  const dbNewsItems = allContent?.filter(c => c.content_type === 'news') || [];

  const newsCategories = [
    { id: "world", label: "World" },
    { id: "tech", label: "Tech" },
    { id: "business", label: "Business" },
    { id: "sports", label: "Sports" },
    { id: "entertainment", label: "Entertainment" },
  ];

  const sidebarItems = [
    { id: "home" as ActiveTab, icon: Home, label: "Home" },
    { id: "news" as ActiveTab, icon: Newspaper, label: "News" },
    { id: "weather" as ActiveTab, icon: Cloud, label: "Weather" },
    { id: "chat" as ActiveTab, icon: MessageCircle, label: "Chat" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1033] to-[#1a0a2e] flex">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Button
            variant="ghost"
            onClick={resetToHome}
            className="w-full justify-start gap-3 text-white hover:bg-white/10 px-2 md:px-4"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold hidden md:inline">Eelai</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => {
                if (item.id === "home") {
                  resetToHome();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full justify-start gap-3 px-3 py-2.5 ${
                activeTab === item.id
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/reels")}
            className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 px-3"
          >
            <Film className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline">Reels</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 px-3 mt-1"
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline">Exit</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-16 md:ml-64 relative z-10">
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          {/* Eelai branding */}
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">your AI companion</span>
          </div>

          {/* HOME TAB */}
          {activeTab === "home" && (
            <>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-10 text-white">
                Discover what's new
              </h1>

              {/* Featured Content Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Featured News Card */}
                {featuredNews && (
                  <Card 
                    className="overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl cursor-pointer group hover:border-primary/50 transition-all"
                    onClick={() => askAboutContent(`Tell me about: ${featuredNews.title}`)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {featuredNews.thumbnail_url ? (
                        <img 
                          src={featuredNews.thumbnail_url} 
                          alt={featuredNews.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center text-6xl">
                          📰
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-red-600/90 text-white border-0 text-xs">
                            {featuredNews.source_name || 'NEWS'}
                          </Badge>
                          <span className="text-xs text-white/80">{featuredNews.source_count} sources</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white leading-tight">
                          {featuredNews.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-4">
                  {/* Daily Briefing Card */}
                  {dailyBriefing && (
                    <Card 
                      className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-xl cursor-pointer hover:border-primary/50 transition-all group"
                      onClick={() => askAboutContent("Give me today's briefing")}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-white">Eelai Daily</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {format(new Date(), "MMM d")} • {dailyBriefing.duration_minutes} min
                          </p>
                          <p className="text-sm text-slate-300 line-clamp-2">
                            {dailyBriefing.summary}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Weather Card */}
                  <Card 
                    className="p-4 bg-gradient-to-br from-sky-900/50 to-blue-900/50 border-sky-700/50 backdrop-blur-xl cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => setActiveTab("weather")}
                  >
                    {weatherLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center shrink-0 animate-pulse">
                          <Cloud className="w-5 h-5 text-sky-400" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-sky-500/20 rounded w-24 animate-pulse" />
                          <div className="h-3 bg-sky-500/20 rounded w-16 animate-pulse" />
                        </div>
                      </div>
                    ) : weather ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{weather.icon}</div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-2xl font-bold text-white">{weather.temperature}°C</span>
                            </div>
                            <p className="text-xs text-sky-300">{weather.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <MapPin className="w-3 h-3" />
                            <span>{weather.location}</span>
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">{format(new Date(), "EEEE")}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Cloud className="w-5 h-5 text-sky-400" />
                        <span className="text-sm text-sky-300">Weather unavailable</span>
                      </div>
                    )}
                  </Card>

                  {/* News Button */}
                  <Card 
                    className="p-4 bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-700/50 backdrop-blur-xl cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => setActiveTab("news")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shrink-0">
                        <Newspaper className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Browse News</h4>
                        <p className="text-xs text-white/60">Real-time global news</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {["What is Ligam.tv?", "Trending News", "Tech Updates", "Weather forecast"].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-primary/50 text-slate-300"
                    onClick={() => askAboutContent(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </>
          )}

          {/* NEWS TAB */}
          {activeTab === "news" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">News</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadNews()}
                  disabled={newsLoading}
                  className="gap-2 border-slate-700/50"
                >
                  <RefreshCw className={`w-4 h-4 ${newsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {newsCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={newsCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setNewsCategory(cat.id);
                      loadNews(cat.id);
                    }}
                    className={newsCategory === cat.id ? "" : "border-slate-700/50 text-slate-300"}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* News List */}
              {newsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : newsItems.length > 0 ? (
                <div className="space-y-4">
                  {newsItems.map((news) => (
                    <Card 
                      key={news.id}
                      className="p-4 bg-slate-800/50 border-slate-700/50 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {news.source}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-white mb-2">{news.title}</h3>
                          {news.description && (
                            <p className="text-sm text-slate-400 line-clamp-2">{news.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => askAboutContent(`Tell me more about: ${news.title}`)}
                            className="text-primary"
                          >
                            Ask Eelai
                          </Button>
                          {news.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(news.url, "_blank")}
                              className="gap-1 border-slate-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Source
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 bg-slate-800/50 border-slate-700/50 text-center">
                  <Newspaper className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <p className="text-slate-400">No news found. Try a different category or refresh.</p>
                </Card>
              )}
            </>
          )}

          {/* WEATHER TAB */}
          {activeTab === "weather" && (
            <>
              <h1 className="text-3xl font-bold text-white mb-6">Weather</h1>

              {weatherLoading ? (
                <Card className="p-8 bg-slate-800/50 border-slate-700/50 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                </Card>
              ) : weather ? (
                <Card className="p-8 bg-gradient-to-br from-sky-900/50 to-blue-900/50 border-sky-700/50 backdrop-blur-xl">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="text-8xl mb-4">{weather.icon}</div>
                    <div className="text-6xl font-bold text-white mb-2">{weather.temperature}°C</div>
                    <p className="text-xl text-sky-300">{weather.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-white/60">
                      <MapPin className="w-4 h-4" />
                      <span>{weather.location}</span>
                    </div>
                    <p className="text-sm text-white/40 mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
                  </div>

                  <Button
                    onClick={() => askAboutContent(`What's the detailed weather forecast for ${weather.location}?`)}
                    className="w-full"
                  >
                    Ask Eelai for detailed forecast
                  </Button>
                </Card>
              ) : (
                <Card className="p-8 bg-slate-800/50 border-slate-700/50 text-center">
                  <Cloud className="w-12 h-12 mx-auto text-slate-500 mb-4" />
                  <p className="text-slate-400">Weather data unavailable</p>
                </Card>
              )}
            </>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <>
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Chat with Eelai</h1>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    Ask me anything about Ligam.tv, news, weather, or just have a conversation!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["What is Ligam.tv?", "Latest tech news", "How's the weather?", "Tell me a fun fact"].map((q) => (
                      <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="bg-slate-800/50 border-slate-700/50"
                        onClick={() => askAboutContent(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 mb-4">
                  <ScrollArea className="h-[500px] p-4">
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "assistant" && (
                            <Avatar className="w-8 h-8 shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                <Sparkles className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800/80 text-slate-200"
                            }`}
                          >
                            {msg.role === "assistant" ? (
                              <div className="prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8 shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                              <Sparkles className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-slate-800/80 rounded-2xl px-4 py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </>
          )}

          {/* Chat Input - Always visible */}
          <Card className="p-3 bg-slate-800/60 backdrop-blur-xl border-slate-700/50 rounded-2xl sticky bottom-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <Plus className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                className="shrink-0 text-slate-400 hover:text-white hover:bg-slate-700/50 gap-1 px-3"
              >
                <span className="text-sm">Smart</span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <Mic className="w-5 h-5" />
              </Button>

              {input.trim() && (
                <Button
                  onClick={handleSend}
                  disabled={isLoading}
                  size="icon"
                  className="shrink-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>

          {/* Videos Section - Only on home */}
          {activeTab === "home" && videoItems.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Short Videos</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/reels")}
                  className="text-primary hover:text-primary/80"
                >
                  Watch all →
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {videoItems.slice(0, 4).map((video) => (
                  <Card 
                    key={video.id} 
                    className="overflow-hidden bg-slate-800/50 border-slate-700/50 cursor-pointer group hover:border-primary/50 transition-all"
                    onClick={() => navigate("/reels")}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-4xl">
                          🎬
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-4 h-4 text-slate-900 ml-0.5" />
                        </div>
                      </div>
                      {video.duration_minutes && (
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-xs text-white">
                          {video.duration_minutes}:00
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h4 className="text-sm font-medium text-white line-clamp-2">{video.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <Eye className="w-3 h-3" />
                        <span>{video.view_count?.toLocaleString() || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* More News - Only on home */}
          {activeTab === "home" && dbNewsItems.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-white mb-4">More Stories</h2>
              <div className="space-y-3">
                {dbNewsItems.slice(0, 5).map((news) => (
                  <Card 
                    key={news.id}
                    className="p-4 bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-primary/50 transition-all flex gap-4"
                    onClick={() => askAboutContent(`Tell me about: ${news.title}`)}
                  >
                    {news.thumbnail_url && (
                      <img 
                        src={news.thumbnail_url} 
                        alt={news.title}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {news.source_name || 'News'}
                        </Badge>
                        <span className="text-xs text-slate-500">{news.source_count} sources</span>
                      </div>
                      <h4 className="font-medium text-white line-clamp-2">{news.title}</h4>
                      {news.summary && (
                        <p className="text-sm text-slate-400 line-clamp-1 mt-1">{news.summary}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discovery;
