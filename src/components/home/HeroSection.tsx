import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/browse?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="pt-16 pb-4 px-4 md:px-6 lg:px-8">
      <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <h1 className="text-lg sm:text-xl font-display font-bold leading-tight shrink-0">
          <span className="text-foreground">Create.</span>
          <span className="text-primary mx-1">Watch.</span>
          <span className="text-foreground">Thrive.</span>
        </h1>
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search streams, shop, freelance, courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 text-sm bg-card border-border"
          />
        </form>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/browse">
            <Button size="sm" variant="default">
              <Play className="w-3 h-3 mr-1" /> Watch Live
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => navigate(user ? "/dashboard" : "/signup")}>
            Start Creating
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
