import { Search, SlidersHorizontal, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FreelanceHeader = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
  onOpenMobileFilters,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search freelancers by name, skill, or keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 text-base bg-card border-border"
        />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={onOpenMobileFilters}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalResults}</span> freelancers found
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] bg-card">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="jobs">Most Jobs</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden sm:flex items-center border border-border rounded-lg bg-card p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3",
                viewMode === "grid" && "bg-muted"
              )}
              onClick={() => onViewModeChange("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-3",
                viewMode === "list" && "bg-muted"
              )}
              onClick={() => onViewModeChange("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceHeader;
