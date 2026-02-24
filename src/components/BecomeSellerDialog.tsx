import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Package, DollarSign } from "lucide-react";

interface BecomeSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BecomeSellerDialog = ({ open, onOpenChange }: BecomeSellerDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      toast.error("Please log in to become a seller");
      navigate("/login");
      onOpenChange(false);
      return;
    }
    
    toast.success("Welcome! You can now list your products.");
    onOpenChange(false);
    navigate("/dashboard?tab=products");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            Become a Seller
          </DialogTitle>
          <DialogDescription>
            Start selling your digital creations on Ligam marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <Package className="h-8 w-8 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">List Your Products</h4>
                <p className="text-sm text-muted-foreground">
                  Upload overlays, emotes, alerts, and other digital assets for streamers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <DollarSign className="h-8 w-8 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Earn Money</h4>
                <p className="text-sm text-muted-foreground">
                  Set your own prices and earn from every sale you make.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleGetStarted} className="w-full glow" size="lg">
              Get Started as a Seller
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By becoming a seller, you agree to our seller terms and conditions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeSellerDialog;
