import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVirtualGifts } from "@/hooks/useVirtualGifts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TipDialog = ({ streamId, recipientId, onTipSent }) => {
  const [open, setOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const { user } = useAuth();
  const { data: gifts = [] } = useVirtualGifts();
  const { toast } = useToast();

  const handleSendTip = async () => {
    if (!selectedGift || !user) return;

    setSending(true);
    try {
      const gift = gifts.find(g => g.id === selectedGift);
      if (!gift) throw new Error("Gift not found");

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

      await supabase
        .from("earnings")
        .insert({
          user_id: recipientId,
          amount: gift.price * 0.8,
          type: "tip",
          source_id: streamId,
          status: "completed",
        });

      toast({
        title: "Tip sent! 🎉",
        description: `You sent a ${gift.name} ${gift.icon} to the streamer!`,
      });

      onTipSent?.({
        amount: gift.price,
        message,
        giftName: gift.name,
        giftIcon: gift.icon,
      });

      setOpen(false);
      setSelectedGift(null);
      setMessage("");
    } catch (error) {
      console.error("Error sending tip:", error);
      toast({
        title: "Failed to send tip",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const selectedGiftData = gifts.find(g => g.id === selectedGift);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gift className="w-4 h-4 text-primary" />
          Send Tip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Send a Gift / Tip
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Choose a gift:</p>
            <div className="grid grid-cols-4 gap-2">
              {gifts.map((gift) => {
                const isSelected = selectedGift === gift.id;
                
                return (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center hover:scale-105 ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{gift.icon}</div>
                    <p className="text-xs font-medium text-foreground truncate">{gift.name}</p>
                    <p className="text-xs text-primary font-bold">${gift.price}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Add a message (optional):
            </p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message will be highlighted in chat!"
              maxLength={200}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {message.length}/200
            </p>
          </div>

          <Button
            onClick={handleSendTip}
            disabled={!selectedGift || sending || !user}
            className="w-full"
            size="lg"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : selectedGiftData ? (
              <>
                <span className="mr-2">{selectedGiftData.icon}</span>
                Send {selectedGiftData.name} - ${selectedGiftData.price.toFixed(2)}
              </>
            ) : (
              "Select a gift"
            )}
          </Button>

          {!user && (
            <p className="text-sm text-center text-muted-foreground">
              Please sign in to send tips
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TipDialog;
