import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useVirtualGifts } from "@/hooks/useVirtualGifts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gift } from "lucide-react";

interface StreamGiftsProps {
  streamId: string;
  recipientId: string;
  onGiftSent?: (gift: { 
    giftName: string; 
    giftIcon: string; 
    amount: number; 
    message?: string;
    senderName: string;
  }) => void;
}

const StreamGifts = ({ streamId, recipientId, onGiftSent }: StreamGiftsProps) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const { user } = useAuth();
  const { data: gifts = [] } = useVirtualGifts();
  const { toast } = useToast();

  const handleSendGift = async () => {
    if (!selectedGift || !user) {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to send gifts",
          variant: "destructive",
        });
      }
      return;
    }

    setSending(true);
    try {
      const gift = gifts.find(g => g.id === selectedGift);
      if (!gift) throw new Error("Gift not found");

      // Get user profile for sender name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("user_id", user.id)
        .single();

      const senderName = profile?.display_name || profile?.username || "Anonymous";

      // Insert gift transaction
      const { error } = await supabase
        .from("gift_transactions")
        .insert({
          gift_id: selectedGift,
          sender_id: user.id,
          recipient_id: recipientId,
          stream_id: streamId,
          amount: gift.price,
          message: message || null,
        });

      if (error) throw error;

      // Add to earnings
      await supabase
        .from("earnings")
        .insert({
          user_id: recipientId,
          amount: gift.price * 0.8,
          type: "gift",
          source_id: streamId,
          status: "completed",
        });

      toast({
        title: "Gift sent! 🎉",
        description: `You sent a ${gift.name} ${gift.icon}!`,
      });

      onGiftSent?.({
        giftName: gift.name,
        giftIcon: gift.icon,
        amount: gift.price,
        message: message || undefined,
        senderName,
      });

      setSelectedGift(null);
      setMessage("");
    } catch (error) {
      console.error("Error sending gift:", error);
      toast({
        title: "Failed to send gift",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const selectedGiftData = gifts.find(g => g.id === selectedGift);

  return (
    <Card className="p-3 bg-card/50 border-border">
      <h3 className="font-semibold text-foreground mb-2 text-sm flex items-center gap-2">
        <Gift className="w-4 h-4 text-primary" />
        Send a Gift
      </h3>
      
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {gifts.slice(0, 8).map((gift) => {
          const isSelected = selectedGift === gift.id;
          
          return (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift.id)}
              className={`p-2 rounded-lg border transition-all text-center hover:scale-105 ${
                isSelected
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="text-lg">{gift.icon}</div>
              <p className="text-[10px] text-primary font-bold">${gift.price}</p>
            </button>
          );
        })}
      </div>

      {selectedGift && (
        <div className="space-y-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message (optional)"
            maxLength={100}
            className="resize-none text-sm h-14"
          />
          <Button
            onClick={handleSendGift}
            disabled={sending || !user}
            className="w-full"
            size="sm"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span className="mr-1">{selectedGiftData?.icon}</span>
                Send ${selectedGiftData?.price}
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default StreamGifts;
