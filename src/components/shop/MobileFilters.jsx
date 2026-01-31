import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const MobileFilters = ({
  open,
  onOpenChange,
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onSaleOnly,
  onSaleOnlyChange,
  inStockOnly,
  onInStockOnlyChange,
}) => {
  const handleCategoryClick = (category) => {
    onCategoryChange(category);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0 bg-background border-border">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onCategoryChange("All");
                onPriceRangeChange([0, maxPrice]);
                onSaleOnlyChange(false);
                onInStockOnlyChange(false);
              }}
            >
              Clear All
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      activeCategory === category
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">{category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Price Range */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Price Range
              </h3>
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value)}
                max={maxPrice}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="px-3 py-1.5 rounded-md bg-secondary text-foreground">
                  ${priceRange[0]}
                </span>
                <span className="text-muted-foreground">to</span>
                <span className="px-3 py-1.5 rounded-md bg-secondary text-foreground">
                  ${priceRange[1]}
                </span>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Filters
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={onSaleOnly}
                  onCheckedChange={(checked) => onSaleOnlyChange(checked)}
                />
                <span className="text-sm text-foreground">On Sale</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={(checked) => onInStockOnlyChange(checked)}
                />
                <span className="text-sm text-foreground">In Stock Only</span>
              </label>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
