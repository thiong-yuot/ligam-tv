import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Loader2, CheckCircle } from "lucide-react";
import { useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ContactFreelancerDialogProps {
  freelancerId: string;
  freelancerUserId: string;
  freelancerName: string;
  children?: React.ReactNode;
}

const ContactFreelancerDialog = ({
  freelancerId,
  freelancerUserId,
  freelancerName,
  children,
}: ContactFreelancerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact freelancers.",
        variant: "destructive",
      });
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMessage.mutateAsync({
        recipient_id: freelancerUserId,
        freelancer_id: freelancerId,
        subject: subject.trim() || undefined,
        content: message.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        setSubject("");
        setMessage("");
        setSuccess(false);
        setOpen(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const goToMessages = () => {
    setOpen(false);
    navigate(`/messages?user=${freelancerUserId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {freelancerName}</DialogTitle>
        </DialogHeader>
        
        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Message Sent!</h3>
            <p className="text-muted-foreground mb-4">
              Your message has been sent to {freelancerName}.
            </p>
            <Button onClick={goToMessages} variant="outline">
              View Conversation
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (optional)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your project or question..."
                rows={5}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={sendMessage.isPending}
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Message
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Messages are private between you and the freelancer
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactFreelancerDialog;
