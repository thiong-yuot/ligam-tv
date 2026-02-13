import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveStreamsSection from "@/components/home/LiveStreamsSection";
import PaidStreamsPreview from "@/components/home/PaidStreamsPreview";
import MarketplacePreview from "@/components/home/MarketplacePreview";
import FreelancersPreview from "@/components/home/FreelancersPreview";
import CoursesPreview from "@/components/courses/CoursesPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-2">
        <LiveStreamsSection />
        <PaidStreamsPreview />
        <section className="py-4 px-4 md:px-6 lg:px-8">
          <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <MarketplacePreview compact />
            <CoursesPreview compact />
            <FreelancersPreview compact />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
