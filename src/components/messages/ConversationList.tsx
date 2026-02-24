import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Message } from "@/hooks/useMessages";

interface ConversationItem {
  otherUserId: string;
  otherProfile?: Message["sender_profile"];
  lastMessage: Message;
  unreadCount: number;
}

interface ConversationListProps {
  conversations: ConversationItem[];
  selectedUserId: string | null;
  onSelect: (userId: string) => void;
  currentUserId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const formatConversationTime = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

export const ConversationList = ({
  conversations,
  selectedUserId,
  onSelect,
  currentUserId,
  searchQuery,
  onSearchChange,
  className,
}: ConversationListProps) => {
  const navigate = useNavigate();

  const filtered = conversations.filter(c => {
    if (!searchQuery) return true;
    const name = c.otherProfile?.display_name || c.otherProfile?.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-muted/30 border-0 text-sm"
          />
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No messages</p>
            <p className="text-xs mt-1 text-muted-foreground/70">Start a conversation with creators, sellers, or freelancers</p>
          </div>
        ) : (
          filtered.map(({ otherUserId, otherProfile, lastMessage, unreadCount }) => (
            <button
              key={otherUserId}
              onClick={() => onSelect(otherUserId)}
              className={cn(
                "w-full px-3 py-3 flex items-center gap-3 transition-colors text-left",
                "hover:bg-muted/40",
                selectedUserId === otherUserId && "bg-muted/50"
              )}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={otherProfile?.avatar_url || undefined} />
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {otherProfile?.display_name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">
                    {otherProfile?.display_name || otherProfile?.username || "User"}
                  </p>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatConversationTime(lastMessage.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className={cn(
                    "text-xs truncate",
                    unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {lastMessage.sender_id === currentUserId && (
                      <span className="text-muted-foreground/70 mr-1">You:</span>
                    )}
                    {lastMessage.content}
                  </p>
                  {unreadCount > 0 && (
                    <Badge className="h-4 min-w-[16px] px-1 flex items-center justify-center text-[10px] rounded-full">
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
  );
};
