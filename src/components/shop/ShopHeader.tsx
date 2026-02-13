import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price-low" | "price-high" | "popular" | "rating";

interface ShopHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalItems: number;
  productCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onMobileFilterClick: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-low", label: "Price ↑" },
  { value: "price-high", label: "Price ↓" },
];

const ShopHeader = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onMobileFilterClick,
}: ShopHeaderProps) => {
  const currentSort = sortOptions.find((o) => o.value === sortBy);

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMobileFilterClick}
      >
        <SlidersHorizontal className="w-4 h-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 shrink-0">
            {currentSort?.label}
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-popover border-border">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn("cursor-pointer", sortBy === option.value && "bg-primary/10 text-primary")}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ShopHeader;
