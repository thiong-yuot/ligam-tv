import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FreelanceHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  totalResults: number;
  onOpenMobileFilters: () => void;
}

const FreelanceHeader = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalResults,
  onOpenMobileFilters,
}: FreelanceHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search freelancers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      <Button
        variant="outline"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onOpenMobileFilters}
      >
        <SlidersHorizontal className="w-4 h-4" />
      </Button>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-32 bg-card shrink-0">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="jobs">Most Jobs</SelectItem>
          <SelectItem value="price-low">Price ↑</SelectItem>
          <SelectItem value="price-high">Price ↓</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FreelanceHeader;
