import { X, Star, Video, Palette, Music, Mic, Clapperboard, Box, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Video Editing", icon: Video },
  { name: "Graphic Design", icon: Palette },
  { name: "Music Production", icon: Music },
  { name: "Voice Over", icon: Mic },
  { name: "Animation", icon: Clapperboard },
  { name: "3D Modeling", icon: Box },
  { name: "Consulting", icon: Users },
];

const MobileFreelanceFilters = ({
  open,
  onOpenChange,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
}) => {
  const handleCategorySelect = (category) => {
    onCategoryChange(category);
  };

  const handleApply = () => {
    onOpenChange(false);
  };

  const handleReset = () => {
    onCategoryChange("All");
    onPriceRangeChange([0, 200]);
    onMinRatingChange(0);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </SheetHeader>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Hourly Rate</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ${priceRange[0]} - ${priceRange[1]}+
            </p>
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value)}
              max={200}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Minimum Rating</h3>
            <div className="grid grid-cols-4 gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <Button
                  key={rating}
                  variant={minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => onMinRatingChange(rating)}
                  className="w-full"
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
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <Button className="w-full" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFreelanceFilters;