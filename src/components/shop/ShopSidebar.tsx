import { useState } from "react";
import { 
  Smartphone, Monitor, Headphones, Watch, Camera, Gamepad2, 
  Shirt, Home, Car, Dumbbell, Book, Music, Palette, Gift,
  ChevronDown, ChevronRight, Sparkles, TrendingUp, Tag, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categoryIcons: Record<string, React.ElementType> = {
  "Phones & Tablets": Smartphone,
  "Computers": Monitor,
  "Audio": Headphones,
  "Wearables": Watch,
  "Cameras": Camera,
  "Gaming": Gamepad2,
  "Fashion": Shirt,
  "Home & Living": Home,
  "Automotive": Car,
  "Sports": Dumbbell,
  "Books": Book,
  "Music": Music,
  "Art": Palette,
  "Gifts": Gift,
};

interface ShopSidebarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onSaleOnly: boolean;
  onSaleOnlyChange: (checked: boolean) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (checked: boolean) => void;
}

const ShopSidebar = ({
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
}: ShopSidebarProps) => {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const quickLinks = [
    { icon: Sparkles, label: "New Arrivals", value: "new" },
    { icon: TrendingUp, label: "Best Sellers", value: "trending" },
    { icon: Tag, label: "On Sale", value: "sale" },
    { icon: Star, label: "Top Rated", value: "rated" },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="pr-4 space-y-6">
            {/* Quick Links */}
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <button
                  key={link.value}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors text-left"
                >
                  <link.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </button>
              ))}
            </div>

            <div className="h-px bg-border" />

            {/* Categories */}
            <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Categories
                </span>
                {categoriesOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-2">
                {categories.map((category) => {
                  const Icon = categoryIcons[category] || Tag;
                  const isActive = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category}</span>
                    </button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            <div className="h-px bg-border" />

            {/* Price Range */}
            <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Price Range
                </span>
                {priceOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
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
              </CollapsibleContent>
            </Collapsible>

            <div className="h-px bg-border" />

            {/* Filters */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Filters
                </span>
                {filtersOpen ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={onSaleOnly}
                    onCheckedChange={(checked) => onSaleOnlyChange(checked as boolean)}
                  />
                  <span className="text-sm text-foreground">On Sale</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={inStockOnly}
                    onCheckedChange={(checked) => onInStockOnlyChange(checked as boolean)}
                  />
                  <span className="text-sm text-foreground">In Stock Only</span>
                </label>
              </CollapsibleContent>
            </Collapsible>

            <div className="h-px bg-border" />

            {/* Clear Filters */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                onCategoryChange("All");
                onPriceRangeChange([0, maxPrice]);
                onSaleOnlyChange(false);
                onInStockOnlyChange(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default ShopSidebar;
