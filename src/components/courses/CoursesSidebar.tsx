import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Star, X } from "lucide-react";
import { COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";

interface CoursesSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  showFreeOnly: boolean;
  onFreeOnlyChange: (value: boolean) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const CoursesSidebar = ({
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  priceRange,
  onPriceRangeChange,
  showFreeOnly,
  onFreeOnlyChange,
  minRating,
  onMinRatingChange,
  onClearFilters,
  hasActiveFilters,
}: CoursesSidebarProps) => {
  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-6">
      {/* Category Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Category</h3>
        <div className="space-y-1">
          <button
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory || selectedCategory === "all"
                ? "bg-purple-500/10 text-purple-400"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => onCategoryChange("all")}
          >
            All Categories
          </button>
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Level Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Level</h3>
        <div className="space-y-1">
          <button
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedLevel || selectedLevel === "all"
                ? "bg-purple-500/10 text-purple-400"
                : "text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => onLevelChange("all")}
          >
            All Levels
          </button>
          {COURSE_LEVELS.map((level) => (
            <button
              key={level}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                selectedLevel === level
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => onLevelChange(level)}
            >
              {level.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={onPriceRangeChange}
          min={0}
          max={500}
          step={10}
          className="w-full mb-3"
        />
        <div className="flex justify-between text-sm text-muted-foreground mb-3">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
        <Button
          variant={showFreeOnly ? "default" : "outline"}
          size="sm"
          className="w-full"
          onClick={() => onFreeOnlyChange(!showFreeOnly)}
        >
          Free Courses Only
        </Button>
      </div>

      {/* Rating Section */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-foreground mb-3">Minimum Rating</h3>
        <div className="space-y-1">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                minRating === rating
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => onMinRatingChange(rating)}
            >
              {rating === 0 ? (
                "Any Rating"
              ) : (
                <>
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </aside>
  );
};

export default CoursesSidebar;