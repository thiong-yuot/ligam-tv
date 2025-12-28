import { useSubscription, SubscriptionTier } from "./useSubscription";

export type Feature = 
  | "hd_streaming"
  | "4k_streaming"
  | "custom_emotes"
  | "priority_support"
  | "no_ads"
  | "api_access"
  | "custom_overlays"
  | "featured_placement"
  | "dedicated_support";

type FeatureAccess = {
  [key in Feature]: SubscriptionTier[];
};

// Define which tiers have access to each feature
const featureAccess: FeatureAccess = {
  hd_streaming: ["creator", "pro"],
  "4k_streaming": ["pro"],
  custom_emotes: ["creator", "pro"],
  priority_support: ["creator", "pro"],
  no_ads: ["creator", "pro"],
  api_access: ["pro"],
  custom_overlays: ["pro"],
  featured_placement: ["pro"],
  dedicated_support: ["pro"],
};

const featureLabels: Record<Feature, string> = {
  hd_streaming: "HD Streaming",
  "4k_streaming": "4K Streaming",
  custom_emotes: "Custom Emotes",
  priority_support: "Priority Support",
  no_ads: "Ad-Free Viewing",
  api_access: "API Access",
  custom_overlays: "Custom Overlays",
  featured_placement: "Featured Placement",
  dedicated_support: "Dedicated Support",
};

const featureRequiredTier: Record<Feature, string> = {
  hd_streaming: "Creator",
  "4k_streaming": "Pro",
  custom_emotes: "Creator",
  priority_support: "Creator",
  no_ads: "Creator",
  api_access: "Pro",
  custom_overlays: "Pro",
  featured_placement: "Pro",
  dedicated_support: "Pro",
};

export const useFeatureAccess = () => {
  const { tier, subscribed, isLoading } = useSubscription();

  const hasAccess = (feature: Feature): boolean => {
    if (!tier) return false;
    return featureAccess[feature].includes(tier);
  };

  const getRequiredTier = (feature: Feature): string => {
    return featureRequiredTier[feature];
  };

  const getFeatureLabel = (feature: Feature): string => {
    return featureLabels[feature];
  };

  const checkMultipleFeatures = (features: Feature[]): Record<Feature, boolean> => {
    return features.reduce((acc, feature) => {
      acc[feature] = hasAccess(feature);
      return acc;
    }, {} as Record<Feature, boolean>);
  };

  return {
    hasAccess,
    getRequiredTier,
    getFeatureLabel,
    checkMultipleFeatures,
    tier,
    subscribed,
    isLoading,
  };
};
