import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import LiveStreamsSection from "@/components/home/LiveStreamsSection";
import TrendingCategories from "@/components/home/TrendingCategories";
import MarketplacePreview from "@/components/home/MarketplacePreview";
import FreelancersPreview from "@/components/home/FreelancersPreview";
import CoursesPreview from "@/components/courses/CoursesPreview";
import { useCategories } from "@/hooks/useCategories";

const Index = () => {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LiveStreamsSection />
      <TrendingCategories categories={categories} isLoading={categoriesLoading} />
      <MarketplacePreview />
      <FreelancersPreview />
      <CoursesPreview />
      <Footer />
    </div>
  );
};

export default Index;
