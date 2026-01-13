import { useSubscription, SubscriptionTier, SUBSCRIPTION_TIERS, getTierLimits } from "./useSubscription";
import { useMyProducts } from "./useProducts";
import { useCreatorCourses } from "./useCourses";

export type Feature = 
  | "hd_streaming"
  | "4k_streaming"
  | "custom_reactions"
  | "priority_support"
  | "no_ads"
  | "api_access"
  | "custom_overlays"
  | "featured_placement"
  | "dedicated_support"
  | "stream_analytics"
  | "unlimited_products"
  | "limited_products"
  | "full_service_access"
  | "revenue_boost"
  | "unlimited_courses";

type FeatureAccess = {
  [key in Feature]: SubscriptionTier[];
};

// Define which tiers have access to each feature
// Note: full_service_access is available to ALL tiers (including free)
const featureAccess: FeatureAccess = {
  hd_streaming: ["creator", "pro"],
  "4k_streaming": ["pro"],
  custom_reactions: ["creator", "pro"],
  priority_support: ["creator", "pro"],
  no_ads: ["creator", "pro"],
  api_access: ["pro"],
  custom_overlays: ["pro"],
  featured_placement: ["pro"],
  dedicated_support: ["pro"],
  stream_analytics: ["creator", "pro"],
  unlimited_products: ["pro"],
  limited_products: ["creator", "pro"],
  full_service_access: [], // All tiers have this - handled separately
  revenue_boost: ["pro"],
  unlimited_courses: ["pro"],
};

const featureLabels: Record<Feature, string> = {
  hd_streaming: "HD Streaming (1080p)",
  "4k_streaming": "4K Streaming",
  custom_reactions: "Custom Reactions",
  priority_support: "Priority Support",
  no_ads: "Ad-Free Viewing",
  api_access: "API Access",
  custom_overlays: "Custom Overlays",
  featured_placement: "Featured Placement",
  dedicated_support: "Dedicated Support",
  stream_analytics: "Stream Analytics",
  unlimited_products: "Unlimited Store Products",
  limited_products: "Store Access",
  full_service_access: "Full Service Access",
  revenue_boost: "Revenue Boost (+10%)",
  unlimited_courses: "Unlimited Courses",
};

const featureRequiredTier: Record<Feature, string> = {
  hd_streaming: "Creator",
  "4k_streaming": "Pro",
  custom_reactions: "Creator",
  priority_support: "Creator",
  no_ads: "Creator",
  api_access: "Pro",
  custom_overlays: "Pro",
  featured_placement: "Pro",
  dedicated_support: "Pro",
  stream_analytics: "Creator",
  unlimited_products: "Pro",
  limited_products: "Creator",
  full_service_access: "Creator",
  revenue_boost: "Pro",
  unlimited_courses: "Pro",
};

export const useFeatureAccess = () => {
  const { tier, subscribed, isLoading } = useSubscription();
  const { data: myProducts = [], isLoading: productsLoading } = useMyProducts();
  const { data: myCourses = [], isLoading: coursesLoading } = useCreatorCourses();

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

  // Get tier limits based on current subscription
  const getTierInfo = () => {
    return getTierLimits(tier);
  };

  // Get maximum products allowed based on tier
  const getMaxProducts = (): number => {
    const limits = getTierLimits(tier);
    return limits.maxProducts;
  };

  // Get maximum courses allowed based on tier
  const getMaxCourses = (): number => {
    const limits = getTierLimits(tier);
    return limits.maxCourses;
  };

  // Get maximum services allowed based on tier
  const getMaxServices = (): number => {
    const limits = getTierLimits(tier);
    return limits.maxGigs;
  };

  // Check if user can fulfill services (accept and complete jobs)
  // All tiers have full freelance access
  const canFulfillServices = (): boolean => {
    return true; // All tiers can post and fulfill services
  };

  // Check if user can add more products
  const canAddProduct = (): boolean => {
    const maxProducts = getMaxProducts();
    return myProducts.length < maxProducts;
  };

  // Check if user can add more courses
  const canAddCourse = (): boolean => {
    const maxCourses = getMaxCourses();
    return myCourses.length < maxCourses;
  };

  // Get remaining product slots
  const getRemainingProducts = (): number => {
    const maxProducts = getMaxProducts();
    if (maxProducts === Infinity) return Infinity;
    return Math.max(0, maxProducts - myProducts.length);
  };

  // Get remaining course slots
  const getRemainingCourses = (): number => {
    const maxCourses = getMaxCourses();
    if (maxCourses === Infinity) return Infinity;
    return Math.max(0, maxCourses - myCourses.length);
  };

  // Get current counts
  const getCurrentProductCount = (): number => myProducts.length;
  const getCurrentCourseCount = (): number => myCourses.length;

  // Get upgrade message based on what the user is trying to do
  const getUpgradeMessage = (action: "product" | "course" | "service"): string => {
    if (action === "product") {
      if (tier === null) {
        return "You can only add 1 product on the Free tier. Upgrade to Creator for up to 3 products, or Pro for unlimited.";
      }
      if (tier === "creator") {
        return "Upgrade to Pro for unlimited store products.";
      }
    }
    
    if (action === "course") {
      if (tier === null) {
        return "You can only add 1 course on the Free tier. Upgrade to Creator for up to 3 courses, or Pro for unlimited.";
      }
      if (tier === "creator") {
        return "Upgrade to Pro for unlimited courses.";
      }
    }
    
    // Freelance is available to all tiers - no upgrade needed
    if (action === "service") {
      return ""; // All tiers have full freelance access
    }
    
    return "";
  };

  return {
    hasAccess,
    getRequiredTier,
    getFeatureLabel,
    checkMultipleFeatures,
    getTierInfo,
    getMaxProducts,
    getMaxCourses,
    getMaxServices,
    canFulfillServices,
    canAddProduct,
    canAddCourse,
    getRemainingProducts,
    getRemainingCourses,
    getCurrentProductCount,
    getCurrentCourseCount,
    getUpgradeMessage,
    tier,
    subscribed,
    isLoading: isLoading || productsLoading || coursesLoading,
  };
};
