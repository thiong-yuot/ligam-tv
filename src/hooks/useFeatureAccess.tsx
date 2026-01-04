import { useSubscription, SubscriptionTier, SUBSCRIPTION_TIERS } from "./useSubscription";

export type Feature = 
  | "hd_streaming"
  | "4k_streaming"
  | "custom_emotes"
  | "priority_support"
  | "no_ads"
  | "api_access"
  | "custom_overlays"
  | "featured_placement"
  | "dedicated_support"
  | "stream_analytics"
  | "unlimited_products"
  | "limited_products"
  | "full_gig_access"
  | "revenue_boost";

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
  stream_analytics: ["creator", "pro"],
  unlimited_products: ["pro"],
  limited_products: ["creator", "pro"],
  full_gig_access: ["creator", "pro"],
  revenue_boost: ["pro"],
};

const featureLabels: Record<Feature, string> = {
  hd_streaming: "HD Streaming (1080p)",
  "4k_streaming": "4K Streaming",
  custom_emotes: "Custom Emotes",
  priority_support: "Priority Support",
  no_ads: "Ad-Free Viewing",
  api_access: "API Access",
  custom_overlays: "Custom Overlays",
  featured_placement: "Featured Placement",
  dedicated_support: "Dedicated Support",
  stream_analytics: "Stream Analytics",
  unlimited_products: "Unlimited Store Products",
  limited_products: "Store Access",
  full_gig_access: "Full Gig Access",
  revenue_boost: "Revenue Boost (+10%)",
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
  stream_analytics: "Creator",
  unlimited_products: "Pro",
  limited_products: "Creator",
  full_gig_access: "Creator",
  revenue_boost: "Pro",
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

  // Get maximum products allowed based on tier
  const getMaxProducts = (): number => {
    if (!tier) return 1; // Free tier: 1 product
    if (tier === "creator") return SUBSCRIPTION_TIERS.creator.maxProducts;
    if (tier === "pro") return SUBSCRIPTION_TIERS.pro.maxProducts;
    return 1;
  };

  // Check if user can add more products
  const canAddProduct = (currentProductCount: number): boolean => {
    return currentProductCount < getMaxProducts();
  };

  return {
    hasAccess,
    getRequiredTier,
    getFeatureLabel,
    checkMultipleFeatures,
    getMaxProducts,
    canAddProduct,
    tier,
    subscribed,
    isLoading,
  };
};
