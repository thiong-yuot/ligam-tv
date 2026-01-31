import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Loader2 } from "lucide-react";

const FreelancerOrderDialog = ({ 
  open, 
  onOpenChange, 
  package_, 
  freelancer,
  onSubmit,
  loading 
}) => {
  const [requirements, setRequirements] = useState("");

  const handleSubmit = () => {
    onSubmit(requirements);
    setRequirements("");
  };

  if (!package_ || !freelancer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order Service</DialogTitle>
          <DialogDescription>
            You're about to order "{package_.name}" from {freelancer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Package Details */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{package_.name}</h4>
                {package_.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {package_.description}
                  </p>
                )}
              </div>
              <Badge variant="default" className="text-lg font-bold">
                ${package_.price}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{package_.delivery_days} day delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{package_.revisions} revision{package_.revisions !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {package_.features && package_.features.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Includes:</p>
                <ul className="space-y-1">
                  {package_.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Requirements Input */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Project Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Describe what you need for this project..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Provide details about your project to help the creator understand your needs.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !requirements.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${package_.price}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreelancerOrderDialog;
