import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Heart, Sparkles, Crown, Rocket, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useVirtualGifts } from "@/hooks/useVirtualGifts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TipDialogProps {
  streamId: string;
  recipientId: string;
  onTipSent?: (tip: { amount: number; message: string; giftName: string }) => void;
}

const giftIcons: Record<string, React.ElementType> = {
  heart: Heart,
  sparkle: Sparkles,
  crown: Crown,
  rocket: Rocket,
};

const TipDialog = ({ streamId, recipientId, onTipSent }: TipDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
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

      toast({
        title: "Tip sent!",
        description: `You sent a ${gift.name} to the streamer!`,
      });

      onTipSent?.({
        amount: gift.price,
        message,
        giftName: gift.name,
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
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Send a tip">
          <Gift className="w-4 h-4 text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Send a Tip
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Gift Selection */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Choose a gift:</p>
            <div className="grid grid-cols-2 gap-3">
              {gifts.map((gift) => {
                const IconComponent = giftIcons[gift.icon] || Heart;
                const isSelected = selectedGift === gift.id;
                
                return (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-secondary flex items-center justify-center">
                      <IconComponent className={`w-5 h-5 ${
                        gift.icon === 'heart' ? 'text-pink-500' :
                        gift.icon === 'sparkle' ? 'text-yellow-500' :
                        gift.icon === 'crown' ? 'text-amber-500' :
                        'text-blue-500'
                      }`} />
                    </div>
                    <p className="font-medium text-foreground">{gift.name}</p>
                    <p className="text-primary font-bold">${gift.price.toFixed(2)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Input */}
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

          {/* Send Button */}
          <Button
            onClick={handleSendTip}
            disabled={!selectedGift || sending || !user}
            className="w-full"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : selectedGiftData ? (
              `Send ${selectedGiftData.name} - $${selectedGiftData.price.toFixed(2)}`
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