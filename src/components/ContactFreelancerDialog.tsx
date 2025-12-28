import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Send, Loader2 } from "lucide-react";
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
      navigate("/auth");
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

      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${freelancerName}.`,
      });

      setSubject("");
      setMessage("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
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
          <Button
            type="submit"
            className="w-full gap-2"
            disabled={sendMessage.isPending}
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send Message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFreelancerDialog;
