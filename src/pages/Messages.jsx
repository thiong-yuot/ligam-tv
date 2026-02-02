import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, Send, Loader2, ArrowLeft, User, 
  Paperclip, Image as ImageIcon, File, X, Search,
  CheckCheck, Check, Clock, Star, Briefcase
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, useConversation, useSendMessage, useMarkAsRead } from "@/hooks/useMessages";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { messages, isLoading } = useMessages();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  
  const { data: conversation = [], refetch: refetchConversation } = useConversation(selectedUserId || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  // Handle URL parameter for direct user selection
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [searchParams]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Get unique conversations
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.sender_id === user?.id ? message.recipient_id : message.sender_id;
    const otherProfile = message.sender_id === user?.id ? message.recipient_profile : message.sender_profile;
    
    if (!acc.find(c => c.otherUserId === otherUserId)) {
      const unreadCount = messages.filter(
        m => m.sender_id === otherUserId && !m.is_read
      ).length;
      
      acc.push({
        otherUserId,
        otherProfile,
        lastMessage: message,
        unreadCount,
      });
    }
    return acc;
  }, []);

  // Filter conversations by search
  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true;
    const name = c.otherProfile?.display_name || c.otherProfile?.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedUserId && conversation.length > 0) {
      conversation.forEach(msg => {
        if (msg.recipient_id === user?.id && !msg.is_read) {
          markAsRead.mutate(msg.id);
        }
      });
    }
  }, [selectedUserId, conversation, user?.id, markAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      await sendMessage.mutateAsync({
        recipient_id: selectedUserId,
        content: newMessage.trim(),
      });
      setNewMessage("");
      refetchConversation();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatMessageTime = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, "h:mm a");
    }
    if (isYesterday(date)) {
      return "Yesterday " + format(date, "h:mm a");
    }
    return format(date, "MMM d, h:mm a");
  };

  const formatConversationTime = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return format(date, "h:mm a");
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMM d");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedConversation = conversations.find(c => c.otherUserId === selectedUserId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Communicate with freelancers and clients</p>
        </div>
        
        <div className="grid lg:grid-cols-[350px_1fr] gap-0 h-[calc(100vh-250px)] min-h-[500px] rounded-xl border border-border overflow-hidden bg-card">
          {/* Conversations Sidebar */}
          <div className={cn(
            "flex flex-col border-r border-border bg-card",
            selectedUserId && "hidden lg:flex"
          )}>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50"
                />
              </div>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No messages yet</p>
                  <p className="text-sm mt-1">Start a conversation by contacting a freelancer</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/freelance")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Freelancers
                  </Button>
                </div>
              ) : (
                filteredConversations.map(({ otherUserId, otherProfile, lastMessage, unreadCount }) => (
                  <button
                    key={otherUserId}
                    onClick={() => setSelectedUserId(otherUserId)}
                    className={cn(
                      "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b border-border",
                      selectedUserId === otherUserId && "bg-muted/50"
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherProfile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {otherProfile?.display_name?.[0] || otherProfile?.username?.[0] || <User className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator placeholder */}
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "font-medium truncate",
                          unreadCount > 0 && "text-foreground"
                        )}>
                          {otherProfile?.display_name || otherProfile?.username || "User"}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatConversationTime(lastMessage.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className={cn(
                          "text-sm truncate",
                          unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                          {lastMessage.sender_id === user?.id && (
                            <span className="text-muted-foreground mr-1">You:</span>
                          )}
                          {lastMessage.content}
                        </p>
                        {unreadCount > 0 && (
                          <Badge className="h-5 min-w-[20px] px-1.5 flex items-center justify-center text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className={cn(
            "flex flex-col bg-background",
            !selectedUserId && "hidden lg:flex"
          )}>
            {selectedUserId ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden shrink-0"
                    onClick={() => setSelectedUserId(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation?.otherProfile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedConversation?.otherProfile?.display_name?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {selectedConversation?.otherProfile?.display_name || 
                       selectedConversation?.otherProfile?.username || 
                       "User"}
                    </p>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Online
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/freelancer/${selectedUserId}`)}>
                    View Profile
                  </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {conversation.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      conversation.map((msg, index) => {
                        const isOwn = msg.sender_id === user?.id;
                        const showAvatar = index === 0 || 
                          conversation[index - 1]?.sender_id !== msg.sender_id;
                        
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-2",
                              isOwn ? "justify-end" : "justify-start"
                            )}
                          >
                            {!isOwn && showAvatar && (
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={msg.sender_profile?.avatar_url || undefined} />
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                  {msg.sender_profile?.display_name?.[0] || <User className="h-3 w-3" />}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            {!isOwn && !showAvatar && <div className="w-8" />}
                            
                            <div className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                              isOwn 
                                ? "bg-primary text-primary-foreground rounded-br-md" 
                                : "bg-muted rounded-bl-md"
                            )}>
                              {msg.subject && (
                                <p className={cn(
                                  "font-semibold text-sm mb-1",
                                  isOwn ? "text-primary-foreground" : "text-foreground"
                                )}>
                                  {msg.subject}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                              <div className={cn(
                                "flex items-center justify-end gap-1 mt-1",
                                isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}>
                                <span className="text-[10px]">
                                  {formatMessageTime(msg.created_at)}
                                </span>
                                {isOwn && (
                                  msg.is_read ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-card">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type a message... (Press Enter to send)"
                        className="min-h-[44px] max-h-[120px] resize-none pr-12 bg-muted/50"
                        rows={1}
                      />
                      <div className="absolute right-2 bottom-2 flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      disabled={sendMessage.isPending || !newMessage.trim()}
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-10 w-10 opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your Messages</h3>
                  <p className="text-sm max-w-sm">
                    Select a conversation to view messages or start a new chat with a freelancer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
