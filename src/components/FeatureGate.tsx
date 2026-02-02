import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useFeatureAccess, Feature } from "@/hooks/useFeatureAccess";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Crown, Sparkles } from "lucide-react";

interface FeatureGateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export const FeatureGate = ({ 
  feature, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: FeatureGateProps) => {
  const { hasAccess, getRequiredTier, getFeatureLabel, isLoading } = useFeatureAccess();

  if (isLoading) {
    return <div className="animate-pulse bg-secondary/50 rounded-lg h-20" />;
  }

  if (hasAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const requiredTier = getRequiredTier(feature);
  const isPro = requiredTier === "Pro";

  return (
    <Card className={`p-4 border-dashed ${isPro ? "border-amber-500/50 bg-amber-500/5" : "border-primary/50 bg-primary/5"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPro ? "bg-amber-500/20" : "bg-primary/20"}`}>
          <Lock className={`w-5 h-5 ${isPro ? "text-amber-500" : "text-primary"}`} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {getFeatureLabel(feature)} requires {requiredTier}
          </p>
          <p className="text-sm text-muted-foreground">
            Upgrade to unlock this feature
          </p>
        </div>
        <Link to="/pricing">
          <Button size="sm" className={isPro ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : ""}>
            {isPro ? <Crown className="w-4 h-4 mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Upgrade
          </Button>
        </Link>
      </div>
    </Card>
  );
};

interface FeatureLockedOverlayProps {
  feature: Feature;
  children: ReactNode;
}

export const FeatureLockedOverlay = ({ feature, children }: FeatureLockedOverlayProps) => {
  const { hasAccess, getRequiredTier, getFeatureLabel, isLoading } = useFeatureAccess();

  if (isLoading || hasAccess(feature)) {
    return <>{children}</>;
  }

  const requiredTier = getRequiredTier(feature);
  const isPro = requiredTier === "Pro";

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isPro ? "bg-amber-500/20" : "bg-primary/20"}`}>
            <Lock className={`w-6 h-6 ${isPro ? "text-amber-500" : "text-primary"}`} />
          </div>
          <p className="font-medium text-foreground mb-1">
            {getFeatureLabel(feature)}
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Requires {requiredTier} plan
          </p>
          <Link to="/pricing">
            <Button size="sm" className={isPro ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" : ""}>
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
