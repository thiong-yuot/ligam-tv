import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayCircle, Clock, MoreVertical, Briefcase, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { DiscoveryItem } from "@/pages/Discovery";

interface FreelancerService {
  id: string;
  title: string;
  price: number;
  category: string | null;
  freelancer_id: string;
}

interface VideoCardProps {
  item: DiscoveryItem;
  services: FreelancerService[];
}

const VideoCard = ({ item, services }: VideoCardProps) => {
  const linkTo = item.id.startsWith("stream-")
    ? `/stream/${item.id.replace("stream-", "")}`
    : `/discovery/${item.id}`;

  const creatorName = item.creator?.display_name || item.creator?.username || "Unknown";
  const username = item.creator?.username || "";
  const initials = creatorName.charAt(0).toUpperCase();

  return (
    <div className="group">
      {/* Thumbnail */}
      <Link to={linkTo} className="block">
        <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden mb-2">
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayCircle className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-90 transition-opacity drop-shadow-lg" />
          </div>
          {item.type === "replay" && (
            <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] h-5">
              <Clock className="w-3 h-3 mr-0.5" /> Replay
            </Badge>
          )}
        </div>
      </Link>

      {/* Info row */}
      <div className="flex gap-2.5">
        <Link to={`/@${username}`} className="shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
            {initials}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={linkTo}>
            <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </Link>
          <Link to={`/@${username}`} className="block">
            <p className="text-xs text-muted-foreground mt-0.5 hover:text-foreground transition-colors">
              {creatorName}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground">
            {item.view_count.toLocaleString()} views · {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </p>
        </div>

        {/* 3-dot menu with services */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 mt-0.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg z-50">
            <DropdownMenuItem asChild>
              <Link to={`/@${username}`} className="cursor-pointer">
                View channel
              </Link>
            </DropdownMenuItem>
            {services.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" />
                  Services by {creatorName}
                </DropdownMenuLabel>
                {services.map((service) => (
                  <DropdownMenuItem key={service.id} asChild>
                    <Link to={`/@${username}`} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm truncate mr-2">{service.title}</span>
                      <span className="text-xs font-semibold text-primary flex items-center shrink-0">
                        <DollarSign className="w-3 h-3" />
                        {service.price}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VideoCard;
