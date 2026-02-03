import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BecomeFreelancerDialog from "@/components/BecomeFreelancerDialog";
import FreelanceSidebar from "@/components/freelance/FreelanceSidebar";
import FreelancerCard from "@/components/freelance/FreelancerCard";
import FeaturedFreelancers from "@/components/freelance/FeaturedFreelancers";
import FreelanceHeader from "@/components/freelance/FreelanceHeader";
import MobileFreelanceFilters from "@/components/freelance/MobileFreelanceFilters";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2, LayoutDashboard, Sparkles, Users, Award } from "lucide-react";
import { useFreelancers } from "@/hooks/useFreelancers";
import { useMyFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { useAuth } from "@/hooks/useAuth";

const Freelance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [becomeFreelancerOpen, setBecomeFreelancerOpen] = useState(false);
  
  const { data: freelancers = [], isLoading } = useFreelancers();
  const { data: myProfile } = useMyFreelancerProfile();

  const filteredFreelancers = useMemo(() => {
    let filtered = freelancers.filter((f) => {
      // Category filter
      const matchesCategory = activeCategory === "All" || (f.skills && f.skills.some(skill => 
        skill.toLowerCase().includes(activeCategory.toLowerCase())
      ));
      
      // Search filter
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.bio && f.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Price filter
      const matchesPrice = !f.hourly_rate || 
        (f.hourly_rate >= priceRange[0] && f.hourly_rate <= priceRange[1]);
      
      // Rating filter
      const matchesRating = (f.rating || 0) >= minRating;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });

    // Sort
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
        break;
      case "jobs":
        filtered.sort((a, b) => (b.total_jobs || 0) - (a.total_jobs || 0));
        break;
      case "newest":
        // Already sorted by created_at in hook
        break;
    }

    return filtered;
  }, [freelancers, activeCategory, searchQuery, priceRange, minRating, sortBy]);

  const handleBecomeFreelancer = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (myProfile) {
      navigate("/freelance/dashboard");
    } else {
      setBecomeFreelancerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 pb-8 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Creator Marketplace
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Find Talented <span className="text-primary">Freelancers</span>
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Connect with skilled creators for overlays, music, editing, and more.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {myProfile ? (
                <Button variant="outline" onClick={() => navigate("/freelance/dashboard")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Your Dashboard
                </Button>
              ) : (
                <Button onClick={handleBecomeFreelancer} className="glow">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Become a Freelancer
                </Button>
              )}
            </div>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Award, label: "Vetted Talent", value: "Quality" },
              { icon: Briefcase, label: "Any Project", value: "Flexible" },
              { icon: Users, label: "Direct Chat", value: "Connect" },
              { icon: Sparkles, label: "Fast Delivery", value: "Reliable" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card/50 rounded-xl p-4 border border-border">
                <stat.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="flex gap-8">
            {/* Sidebar */}
            <FreelanceSidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minRating={minRating}
              onMinRatingChange={setMinRating}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Featured Freelancers */}
              {!searchQuery && activeCategory === "All" && (
                <FeaturedFreelancers freelancers={freelancers} />
              )}

              {/* Header with Search & Controls */}
              <FreelanceHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResults={filteredFreelancers.length}
                onOpenMobileFilters={() => setMobileFiltersOpen(true)}
              />

              {/* Freelancers Grid/List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredFreelancers.length > 0 ? (
                <div className={
                  viewMode === "grid"
                    ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "space-y-4"
                }>
                  {filteredFreelancers.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer.id}
                      freelancer={freelancer}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card/50 rounded-xl border border-border">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No freelancers found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {freelancers.length === 0 
                      ? "Be the first to join our freelance marketplace!"
                      : "Try adjusting your search or filters"
                    }
                  </p>
                  {freelancers.length === 0 && (
                    <Button onClick={handleBecomeFreelancer}>
                      Become a Freelancer
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-t from-primary/5 to-background border-t border-border">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Join Our Community
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Offer Your Services?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Create your freelancer profile, set your rates, and start connecting with streamers who need your skills.
            </p>
            <Button size="lg" className="glow" onClick={handleBecomeFreelancer}>
              {myProfile ? (
                <>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4 mr-2" />
                  Start Freelancing Today
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Filters */}
      <MobileFreelanceFilters
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minRating={minRating}
        onMinRatingChange={setMinRating}
      />

      <BecomeFreelancerDialog
        open={becomeFreelancerOpen}
        onOpenChange={setBecomeFreelancerOpen}
      />

      <Footer />
    </div>
  );
};

export default Freelance;
