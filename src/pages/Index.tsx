import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveStreamsSection from "@/components/home/LiveStreamsSection";
import MarketplacePreview from "@/components/home/MarketplacePreview";
import FreelancersPreview from "@/components/home/FreelancersPreview";
import CoursesPreview from "@/components/courses/CoursesPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-2">
        <LiveStreamsSection />
        <MarketplacePreview />
        <FreelancersPreview />
        <CoursesPreview />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
