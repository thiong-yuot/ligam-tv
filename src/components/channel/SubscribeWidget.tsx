import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Sparkles } from "lucide-react";

interface SubscribeWidgetProps {
  creatorName: string;
  onSubscribe?: (tier: string) => void;
  isSubscribed?: boolean;
  currentTier?: string | null;
}

const SubscribeWidget = ({ 
  creatorName, 
  onSubscribe,
  isSubscribed,
  currentTier
}: SubscribeWidgetProps) => {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Support {creatorName}</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        All platform tools are free. Support creators by purchasing their products, courses, and services.
      </p>

      <div className="flex flex-wrap gap-1">
        {["Free Streaming", "Free Tools", "Commission on Sales"].map((feature) => (
          <span 
            key={feature}
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded"
          >
            <Check className="w-2.5 h-2.5" />
            {feature}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default SubscribeWidget;
