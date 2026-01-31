import { Search, ShoppingCart, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSheet from "@/components/CartSheet";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const ShopHeader = ({
  searchQuery,
  onSearchChange,
  totalItems,
  productCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onMobileFilterClick,
}) => {
  const currentSort = sortOptions.find((o) => o.value === sortBy);

  return (
    <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-lg border-b border-border py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 h-12 bg-card border-border text-base"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={onMobileFilterClick}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 h-10">
                <span className="hidden sm:inline">Sort:</span>
                <span className="font-medium">{currentSort?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={cn(
                    "cursor-pointer",
                    sortBy === option.value && "bg-primary/10 text-primary"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Button */}
          <CartSheet
            trigger={
              <Button variant="outline" className="relative gap-2 h-10">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
