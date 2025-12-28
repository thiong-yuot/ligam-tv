import { useState } from "react";
import { 
  Video, 
  Palette, 
  Music, 
  Mic, 
  Clapperboard, 
  Box, 
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FreelanceSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
}

const categories = [
  { name: "All", icon: Sparkles, count: null },
  { name: "Video Editing", icon: Video, count: 24 },
  { name: "Graphic Design", icon: Palette, count: 18 },
  { name: "Music Production", icon: Music, count: 12 },
  { name: "Voice Over", icon: Mic, count: 9 },
  { name: "Animation", icon: Clapperboard, count: 15 },
  { name: "3D Modeling", icon: Box, count: 7 },
  { name: "Consulting", icon: Users, count: 5 },
];

const FreelanceSidebar = ({
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
}: FreelanceSidebarProps) => {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-6">
        {/* Categories */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => onCategoryChange(category.name)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{category.name}</span>
                  {category.count && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isActive ? "bg-primary-foreground/20" : "bg-muted"
                    )}>
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between font-semibold text-foreground mb-4"
          >
            <span>Filters</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showFilters && (
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">
                  Hourly Rate: ${priceRange[0]} - ${priceRange[1]}+
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  max={200}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Rating Filter */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={minRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => onMinRatingChange(rating)}
                      className="flex-1"
                    >
                      {rating === 0 ? (
                        "Any"
                      ) : (
                        <span className="flex items-center gap-1">
                          {rating}
                          <Star className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quick Filters */}
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">
                  Quick Filters
                </label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2 text-primary fill-primary" />
                    Top Rated
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    New Freelancers
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FreelanceSidebar;
