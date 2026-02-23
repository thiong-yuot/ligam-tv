import { useSubscription, SubscriptionTier, SUBSCRIPTION_TIERS, getTierLimits } from "./useSubscription";
import { useMyProducts } from "./useProducts";
import { useCreatorCourses } from "./useCourses";

export type Feature = 
  | "hd_streaming"
  | "4k_streaming"
  | "custom_reactions"
  | "priority_support"
  | "no_ads"
  | "custom_overlays"
  | "featured_placement"
  | "dedicated_support"
  | "stream_analytics"
  | "unlimited_products"
  | "limited_products"
  | "full_service_access"
  | "revenue_boost"
  | "unlimited_courses";

const featureLabels: Record<Feature, string> = {
  hd_streaming: "HD Streaming (1080p)",
  "4k_streaming": "4K Streaming",
  custom_reactions: "Custom Reactions",
  priority_support: "Priority Support",
  no_ads: "Ad-Free Viewing",
  custom_overlays: "Custom Overlays",
  featured_placement: "Featured Placement",
  dedicated_support: "Dedicated Support",
  stream_analytics: "Stream Analytics",
  unlimited_products: "Unlimited Store Products",
  limited_products: "Store Access",
  full_service_access: "Full Service Access",
  revenue_boost: "Revenue Boost",
  unlimited_courses: "Unlimited Courses",
};

export const useFeatureAccess = () => {
  const { tier, subscribed, isLoading } = useSubscription();
  const { data: myProducts = [], isLoading: productsLoading } = useMyProducts();
  const { data: myCourses = [], isLoading: coursesLoading } = useCreatorCourses();

  // All features are now free for everyone
  const hasAccess = (_feature: Feature): boolean => true;

  const getRequiredTier = (_feature: Feature): string => "Free";

  const getFeatureLabel = (feature: Feature): string => featureLabels[feature];

  const checkMultipleFeatures = (features: Feature[]): Record<Feature, boolean> => {
    return features.reduce((acc, feature) => {
      acc[feature] = true;
      return acc;
    }, {} as Record<Feature, boolean>);
  };

  const getTierInfo = () => getTierLimits(tier);
  const getMaxProducts = (): number => Infinity;
  const getMaxCourses = (): number => Infinity;
  const getMaxServices = (): number => Infinity;
  const canFulfillServices = (): boolean => true;
  const canAddProduct = (): boolean => true;
  const canAddCourse = (): boolean => true;
  const getRemainingProducts = (): number => Infinity;
  const getRemainingCourses = (): number => Infinity;
  const getCurrentProductCount = (): number => myProducts.length;
  const getCurrentCourseCount = (): number => myCourses.length;
  const getUpgradeMessage = (_action: "product" | "course" | "service"): string => "";

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
