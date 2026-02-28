import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useMyPaymentLinks, useCreatePaymentLink, useDeactivatePaymentLink } from "@/hooks/usePaymentLinks";
import { Plus, Copy, Link2, XCircle, Check, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PaymentLinks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: links = [], isLoading } = useMyPaymentLinks();
  const createLink = useCreatePaymentLink();
  const deactivateLink = useDeactivatePaymentLink();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!user) {
    navigate(`/login?redirect=${encodeURIComponent("/payment-links")}`);
    return null;
  }

  const handleCreate = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await createLink.mutateAsync({ amount: numAmount, description: description.trim() || undefined });
      toast.success("Payment link created!");
      setOpen(false);
      setAmount("");
      setDescription("");
    } catch {
      toast.error("Failed to create payment link");
    }
  };

  const copyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/pay/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateLink.mutateAsync(id);
      toast.success("Payment link canceled");
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "paid": return "secondary";
      case "canceled": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Payment Links</h1>
              <p className="text-sm text-muted-foreground">Create & share payment links</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" /> Create Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Payment Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">Amount (USD)</label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0.50"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Description (optional)</label>
                    <Textarea
                      placeholder="What is this payment for?"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleCreate} disabled={createLink.isPending} className="w-full">
                    {createLink.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create Payment Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : links.length === 0 ? (
            <Card className="p-8 text-center">
              <Link2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No payment links yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create one to start receiving payments</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <Card key={link.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">${link.amount.toFixed(2)}</span>
                        <Badge variant={statusColor(link.status) as any} className="text-xs capitalize">
                          {link.status}
                        </Badge>
                      </div>
                      {link.description && (
                        <p className="text-sm text-muted-foreground truncate">{link.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {format(new Date(link.created_at), "MMM d, yyyy")}
                        {link.paid_at && ` · Paid ${format(new Date(link.paid_at), "MMM d, yyyy")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {link.status === "active" && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyLink(link.slug, link.id)}
                          >
                            {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeactivate(link.id)}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentLinks;
