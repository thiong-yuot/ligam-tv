import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import LiveStreamsSection from "@/components/home/LiveStreamsSection";
import TrendingCategories from "@/components/home/TrendingCategories";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import MarketplacePreview from "@/components/home/MarketplacePreview";
import FreelancersPreview from "@/components/home/FreelancersPreview";
import CoursesPreview from "@/components/courses/CoursesPreview";
import CTASection from "@/components/home/CTASection";
import { useStreams } from "@/hooks/useStreams";
import { useCategories } from "@/hooks/useCategories";

const Index = () => {
  const { data: streams = [], isLoading: streamsLoading } = useStreams(undefined, true);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveStreamsSection streams={streams} isLoading={streamsLoading} />
      <TrendingCategories categories={categories} isLoading={categoriesLoading} />
      <FeaturesGrid />
      <MarketplacePreview />
      <FreelancersPreview />
      <CoursesPreview />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
