import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BecomeFreelancerDialog from "@/components/BecomeFreelancerDialog";
import FreelancerCard from "@/components/freelance/FreelancerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Loader2, Search, Users, LayoutDashboard } from "lucide-react";
import { useFreelancers } from "@/hooks/useFreelancers";
import { useMyFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { useAuth } from "@/hooks/useAuth";

const Freelance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [becomeFreelancerOpen, setBecomeFreelancerOpen] = useState(false);

  const { data: freelancers = [], isLoading } = useFreelancers();
  const { data: myProfile } = useMyFreelancerProfile();

  const filteredFreelancers = useMemo(() => {
    if (!searchQuery) return freelancers;
    return freelancers.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [freelancers, searchQuery]);

  const handleAction = () => {
    if (!user) { navigate("/auth"); return; }
    if (myProfile) navigate("/dashboard?tab=freelance");
    else setBecomeFreelancerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-16 pb-4 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          <h1 className="text-lg font-display font-bold text-foreground">Freelance</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleAction}>
              {myProfile ? <LayoutDashboard className="w-3.5 h-3.5 mr-1" /> : <Briefcase className="w-3.5 h-3.5 mr-1" />}
              {myProfile ? "Dashboard" : "Join"}
            </Button>
          </div>
        </div>
      </section>

      <main className="px-4 md:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-[1920px] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredFreelancers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No freelancers found</p>
            </div>
          )}
        </div>
      </main>

      <BecomeFreelancerDialog open={becomeFreelancerOpen} onOpenChange={setBecomeFreelancerOpen} />
      <Footer />
    </div>
  );
};

export default Freelance;
