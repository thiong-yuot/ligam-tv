import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Play, Heart } from "lucide-react";

const FeaturedStream = ({
  id,
  title,
  streamer,
  category,
  thumbnail,
  avatar,
  viewers,
  description,
}) => {
  const formatViewers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-card card-shadow">
      {/* Background Image */}
      <div className="relative aspect-[21/9] md:aspect-[21/7] overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/70" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="p-6 md:p-10 max-w-2xl">
            {/* Live Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1.5 bg-destructive text-destructive-foreground text-sm font-bold rounded-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse-live" />
                LIVE NOW
              </span>
              <span className="px-3 py-1.5 bg-primary/20 text-primary text-sm font-medium rounded-lg">
                {category}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-3">
              {title}
            </h2>

            {/* Streamer Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={avatar}
                alt={streamer}
                className="w-10 h-10 rounded-full ring-2 ring-primary"
              />
              <div>
                <p className="font-semibold text-foreground">{streamer}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatViewers(viewers)} watching
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-6 line-clamp-2 hidden md:block">
              {description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link to={`/stream/${id}`}>
                <Button variant="hero" size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Now
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStream;
