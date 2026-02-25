import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Send, Loader2, User, MessageCircle, CheckCheck, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Message } from "@/hooks/useMessages";

interface ChatViewProps {
  conversation: Message[];
  selectedProfile?: {
    display_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
  currentUserId?: string;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onBack: () => void;
  isSending: boolean;
}

const formatMessageTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday " + format(date, "h:mm a");
  return format(date, "MMM d, h:mm a");
};

export const ChatView = ({
  conversation,
  selectedProfile,
  currentUserId,
  newMessage,
  onNewMessageChange,
  onSend,
  onBack,
  isSending,
}: ChatViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            {selectedProfile?.display_name?.[0]?.toUpperCase() || <User className="h-3 w-3" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {selectedProfile?.display_name || selectedProfile?.username || "User"}
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Profile
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {selectedProfile?.display_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {selectedProfile?.display_name || "User"}
                </p>
                {selectedProfile?.username && (
                  <p className="text-xs text-muted-foreground truncate">@{selectedProfile.username}</p>
                )}
              </div>
            </div>
            {selectedProfile?.username && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/user/${selectedProfile.username}`)}
              >
                <Globe className="h-3 w-3 mr-1.5" />
                View full profile
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-3 max-w-2xl mx-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          ) : (
            conversation.map((msg, index) => {
              const isOwn = msg.sender_id === currentUserId;
              const showAvatar = index === 0 || conversation[index - 1]?.sender_id !== msg.sender_id;

              return (
                <div
                  key={msg.id}
                  className={cn("flex gap-2", isOwn ? "justify-end" : "justify-start")}
                >
                  {!isOwn && showAvatar && (
                    <Avatar className="h-6 w-6 shrink-0 mt-1">
                      <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                        {msg.sender_profile?.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {!isOwn && !showAvatar && <div className="w-6" />}

                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    )}
                  >
                    {msg.subject && (
                      <p className={cn(
                        "font-semibold text-xs mb-0.5",
                        isOwn ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {msg.subject}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                    <div className={cn(
                      "flex items-center justify-end gap-1 mt-0.5",
                      isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      <span className="text-[10px]">{formatMessageTime(msg.created_at)}</span>
                      {isOwn && (
                        msg.is_read
                          ? <CheckCheck className="h-3 w-3" />
                          : <Check className="h-3 w-3" />
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

      {/* Input */}
      <div className="px-4 py-3 border-t border-border">
        <form onSubmit={onSend} className="flex items-end gap-2 max-w-2xl mx-auto">
          <Textarea
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(e);
              }
            }}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[100px] resize-none bg-muted/30 border-0 text-sm"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0"
            disabled={isSending || !newMessage.trim()}
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};
