import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, useConversation, useSendMessage, useMarkAsRead, Message } from "@/hooks/useMessages";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ConversationList } from "@/components/messages/ConversationList";
import { ChatView } from "@/components/messages/ChatView";
import { EmptyChat } from "@/components/messages/EmptyChat";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { messages, isLoading } = useMessages();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversation = [], refetch: refetchConversation } = useConversation(selectedUserId || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) setSelectedUserId(userId);
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  // Build conversation list
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.sender_id === user?.id ? message.recipient_id : message.sender_id;
    const otherProfile = message.sender_id === user?.id ? message.recipient_profile : message.sender_profile;

    if (!acc.find(c => c.otherUserId === otherUserId)) {
      const unreadCount = messages.filter(
        m => m.sender_id === otherUserId && !m.is_read
      ).length;
      acc.push({ otherUserId, otherProfile, lastMessage: message, unreadCount });
    }
    return acc;
  }, [] as Array<{
    otherUserId: string;
    otherProfile?: Message["sender_profile"];
    lastMessage: Message;
    unreadCount: number;
  }>);

  // Mark as read
  useEffect(() => {
    if (selectedUserId && conversation.length > 0) {
      conversation.forEach(msg => {
        if (msg.recipient_id === user?.id && !msg.is_read) {
          markAsRead.mutate(msg.id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, conversation, user?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;
    try {
      await sendMessage.mutateAsync({ recipient_id: selectedUserId, content: newMessage.trim() });
      setNewMessage("");
      refetchConversation();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const selectedConversation = conversations.find(c => c.otherUserId === selectedUserId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-14">
        <div className="h-[calc(100vh-56px)] flex">
          {/* Sidebar */}
          <div className={cn(
            "w-full lg:w-[320px] border-r border-border flex flex-col",
            selectedUserId && "hidden lg:flex"
          )}>
            <div className="px-4 py-3 border-b border-border">
              <h1 className="text-sm font-semibold">Inbox</h1>
            </div>
            <ConversationList
              conversations={conversations}
              selectedUserId={selectedUserId}
              onSelect={setSelectedUserId}
              currentUserId={user?.id}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              className="flex-1 min-h-0"
            />
          </div>

          {/* Chat */}
          <div className={cn(
            "flex-1 flex flex-col min-w-0",
            !selectedUserId && "hidden lg:flex"
          )}>
            {selectedUserId ? (
              <ChatView
                conversation={conversation}
                selectedProfile={selectedConversation?.otherProfile}
                currentUserId={user?.id}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSend={handleSend}
                onBack={() => setSelectedUserId(null)}
                isSending={sendMessage.isPending}
              />
            ) : (
              <EmptyChat />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
