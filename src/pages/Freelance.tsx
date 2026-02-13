import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BecomeFreelancerDialog from "@/components/BecomeFreelancerDialog";
import FreelanceSidebar from "@/components/freelance/FreelanceSidebar";
import FreelancerCard from "@/components/freelance/FreelancerCard";
import FreelanceHeader from "@/components/freelance/FreelanceHeader";
import MobileFreelanceFilters from "@/components/freelance/MobileFreelanceFilters";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2, LayoutDashboard } from "lucide-react";
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
      const matchesCategory = activeCategory === "All" || (f.skills && f.skills.some(skill => 
        skill.toLowerCase().includes(activeCategory.toLowerCase())
      ));
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.bio && f.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = !f.hourly_rate || (f.hourly_rate >= priceRange[0] && f.hourly_rate <= priceRange[1]);
      const matchesRating = (f.rating || 0) >= minRating;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesRating;
    });

    switch (sortBy) {
      case "rating": filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "price-low": filtered.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0)); break;
      case "price-high": filtered.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0)); break;
      case "jobs": filtered.sort((a, b) => (b.total_jobs || 0) - (a.total_jobs || 0)); break;
    }

    return filtered;
  }, [freelancers, activeCategory, searchQuery, priceRange, minRating, sortBy]);

  const handleBecomeFreelancer = () => {
    if (!user) { navigate("/login"); return; }
    if (myProfile) navigate("/freelance/dashboard");
    else setBecomeFreelancerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Simple Hero */}
      <section className="pt-24 pb-6 px-4 md:px-6 lg:px-8 bg-background border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Freelance
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Connect with skilled creators for your projects.
            </p>
          </div>
          {myProfile ? (
            <Button variant="outline" size="sm" onClick={() => navigate("/freelance/dashboard")}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Your Dashboard
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleBecomeFreelancer}>
              <Briefcase className="w-4 h-4 mr-2" />
              Become a Freelancer
            </Button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="flex gap-8">
            <FreelanceSidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minRating={minRating}
              onMinRatingChange={setMinRating}
            />

            <div className="flex-1 min-w-0">
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

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredFreelancers.length > 0 ? (
                <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-4"}>
                  {filteredFreelancers.map((freelancer) => (
                    <FreelancerCard key={freelancer.id} freelancer={freelancer} viewMode={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card rounded-xl border border-border">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No freelancers found</h3>
                  <p className="text-muted-foreground mb-4">
                    {freelancers.length === 0 ? "Be the first to join!" : "Try adjusting your filters"}
                  </p>
                  {freelancers.length === 0 && (
                    <Button onClick={handleBecomeFreelancer}>Become a Freelancer</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

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

      <BecomeFreelancerDialog open={becomeFreelancerOpen} onOpenChange={setBecomeFreelancerOpen} />
      <Footer />
    </div>
  );
};

export default Freelance;
