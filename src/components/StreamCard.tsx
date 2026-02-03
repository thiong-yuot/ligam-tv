import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

interface StreamCardProps {
  id: string;
  title: string;
  streamer: string;
  category: string;
  thumbnail: string;
  avatar: string;
  viewers: number;
  isLive?: boolean;
}

const StreamCard = ({
  id,
  title,
  streamer,
  category,
  thumbnail,
  avatar,
  viewers,
  isLive = true,
}: StreamCardProps) => {
  const formatViewers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Link to={`/stream/${id}`} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-card border border-border hover-lift">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Live Badge & Viewers */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {isLive && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-destructive-foreground rounded-full animate-pulse-live" />
                LIVE
              </span>
            )}
            <span className="px-2 py-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViewers(viewers)}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
              {category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={avatar}
                alt={streamer}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary transition-all duration-300"
              />
              {isLive && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-card" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{streamer}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StreamCard;
