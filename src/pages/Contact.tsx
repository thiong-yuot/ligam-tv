import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@/hooks/useContact";
import { Send, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitContact.mutateAsync({ name, email, subject, message });
      toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-lg font-display font-bold text-foreground mb-1">Get in Touch</h1>
          <p className="text-xs text-muted-foreground mb-6">Send us a message and we'll respond within 24 hours.</p>

          {/* Quick info */}
          <div className="flex items-center gap-4 mb-6 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> support@ligam.tv</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 24/7 support</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs">Name</Label>
                <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="h-8 text-xs" maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-8 text-xs" maxLength={255} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-xs">Subject</Label>
              <Input id="subject" placeholder="How can we help?" value={subject} onChange={(e) => setSubject(e.target.value)} required className="h-8 text-xs" maxLength={200} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs">Message</Label>
              <Textarea id="message" placeholder="Tell us more..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required className="text-xs" maxLength={1000} />
            </div>

            <Button type="submit" className="w-full gap-2" size="sm" disabled={submitContact.isPending}>
              <Send className="w-3.5 h-3.5" />
              {submitContact.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Looking for quick answers?</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/help" className="text-xs text-primary hover:underline font-medium">Help Center</Link>
              <span className="text-border">·</span>
              <Link to="/faq" className="text-xs text-primary hover:underline font-medium">FAQ</Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
