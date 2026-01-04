import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Sparkles, Zap } from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@/hooks/useSubscription";

interface SubscribeWidgetProps {
  creatorName: string;
  onSubscribe?: (tier: 'creator' | 'pro') => void;
  isSubscribed?: boolean;
  currentTier?: string | null;
}

const SubscribeWidget = ({ 
  creatorName, 
  onSubscribe,
  isSubscribed,
  currentTier
}: SubscribeWidgetProps) => {
  const tiers = [
    {
      key: 'creator' as const,
      name: 'Creator',
      price: SUBSCRIPTION_TIERS.creator.price,
      icon: Sparkles,
      color: 'from-primary to-purple-500',
      features: ['HD Streams', 'Custom Emotes', 'No Ads'],
    },
    {
      key: 'pro' as const,
      name: 'Pro',
      price: SUBSCRIPTION_TIERS.pro.price,
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      features: ['4K Streams', 'All Features', '+10% Revenue'],
    },
  ];

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Support {creatorName}</h3>
      </div>
      
      <div className="space-y-3">
        {tiers.map((tier) => {
          const isCurrentTier = currentTier === tier.key;
          const TierIcon = tier.icon;
          
          return (
            <div 
              key={tier.key}
              className={`p-3 rounded-lg border transition-all ${
                isCurrentTier 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                    <TierIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{tier.name}</p>
                    <p className="text-xs text-muted-foreground">${tier.price}/mo</p>
                  </div>
                </div>
                {isCurrentTier ? (
                  <Badge variant="outline" className="text-xs">
                    Subscribed
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onSubscribe?.(tier.key)}
                    className="text-xs h-7"
                  >
                    Subscribe
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {tier.features.map((feature) => (
                  <span 
                    key={feature}
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded"
                  >
                    <Check className="w-2.5 h-2.5" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SubscribeWidget;