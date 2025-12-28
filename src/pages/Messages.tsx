import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, ArrowLeft, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, useConversation, useSendMessage, useMarkAsRead, Message } from "@/hooks/useMessages";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { messages, isLoading } = useMessages();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: conversation = [], refetch: refetchConversation } = useConversation(selectedUserId || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

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
  }, [] as Array<{
    otherUserId: string;
    otherProfile?: Message["sender_profile"];
    lastMessage: Message;
    unreadCount: number;
  }>);

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

  const handleSendMessage = async (e: React.FormEvent) => {
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedConversation = conversations.find(c => c.otherUserId === selectedUserId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Contact a freelancer to start a conversation</p>
                  </div>
                ) : (
                  conversations.map(({ otherUserId, otherProfile, lastMessage, unreadCount }) => (
                    <button
                      key={otherUserId}
                      onClick={() => setSelectedUserId(otherUserId)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left border-b ${
                        selectedUserId === otherUserId ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={otherProfile?.avatar_url || undefined} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {otherProfile?.display_name || otherProfile?.username || "User"}
                          </p>
                          {unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage.content}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2">
            {selectedUserId ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedUserId(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar>
                      <AvatarImage src={selectedConversation?.otherProfile?.avatar_url || undefined} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedConversation?.otherProfile?.display_name || 
                         selectedConversation?.otherProfile?.username || 
                         "User"}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {conversation.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_id === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sender_id === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.subject && (
                              <p className="font-semibold text-sm mb-1">{msg.subject}</p>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender_id === user?.id
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}>
                              {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t flex gap-2"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={sendMessage.isPending || !newMessage.trim()}>
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
