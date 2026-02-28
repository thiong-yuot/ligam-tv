import { useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePaymentLinkBySlug } from "@/hooks/usePaymentLinks";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const PayLink = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const { data: link, isLoading, error } = usePaymentLinkBySlug(slug || "");
  const [paying, setPaying] = useState(false);

  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";

  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    if (link?.creator_id) {
      supabase
        .from("profiles")
        .select("display_name, username")
        .eq("user_id", link.creator_id)
        .single()
        .then(({ data }) => {
          setCreatorName(data?.display_name || data?.username || "Creator");
        });
    }
  }, [link?.creator_id]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const { data, error } = await supabase.functions.invoke("pay-link", {
        body: { slug },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Failed to start payment");
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
          <Card className="p-8 text-center max-w-sm w-full">
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-sm text-muted-foreground">Your payment has been processed successfully.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (canceled) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
          <Card className="p-8 text-center max-w-sm w-full">
            <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Payment Canceled</h2>
            <p className="text-sm text-muted-foreground">You can try again if you change your mind.</p>
            <Button onClick={() => window.location.replace(`/pay/${slug}`)} className="mt-4">
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
          <Card className="p-8 text-center max-w-sm w-full">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Link Not Found</h2>
            <p className="text-sm text-muted-foreground">This payment link doesn't exist or has expired.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (link.status !== "active") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
          <Card className="p-8 text-center max-w-sm w-full">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              {link.status === "paid" ? "Already Paid" : "Link Unavailable"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {link.status === "paid"
                ? "This payment link has already been used."
                : "This payment link is no longer active."}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 flex items-center justify-center min-h-[60vh] px-4">
        <Card className="p-8 text-center max-w-sm w-full">
          <DollarSign className="w-10 h-10 text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-1">Payment request from</p>
          <p className="font-semibold text-foreground mb-4">{creatorName}</p>
          <p className="text-3xl font-bold text-foreground mb-2">${link.amount.toFixed(2)}</p>
          {link.description && (
            <p className="text-sm text-muted-foreground mb-6">{link.description}</p>
          )}
          <Button onClick={handlePay} disabled={paying} className="w-full" size="lg">
            {paying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Pay ${link.amount.toFixed(2)}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Secured by Stripe</p>
        </Card>
      </div>
    </div>
  );
};

export default PayLink;
