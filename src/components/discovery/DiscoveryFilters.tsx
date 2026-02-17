import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

interface DiscoveryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
}

const DiscoveryFilters = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filterType,
  onFilterTypeChange,
}: DiscoveryFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search videos..."
          className="pl-8 h-9 text-sm"
        />
      </div>

      <Select value={filterType} onValueChange={onFilterTypeChange}>
        <SelectTrigger className="w-[130px] h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
          <SelectItem value="replay">Replays</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="most_viewed">Most viewed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DiscoveryFilters;
