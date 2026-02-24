import { MessageCircle } from "lucide-react";

export const EmptyChat = () => (
  <div className="h-full flex items-center justify-center text-muted-foreground">
    <div className="text-center">
      <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium text-foreground/70">Select a conversation</p>
      <p className="text-xs mt-1 text-muted-foreground/60">Chat with creators, sellers, and freelancers</p>
    </div>
  </div>
);
