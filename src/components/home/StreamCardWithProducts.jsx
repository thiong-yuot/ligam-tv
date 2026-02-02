import { Link } from "react-router-dom";
import { Eye, ShoppingBag, ExternalLink } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const StreamCardWithProducts = ({
  id,
  title,
  streamer,
  userId,
  category,
  thumbnail,
  avatar,
  viewers,
  isLive = true,
}) => {
  const { products, isLoading } = useProducts({ sellerId: userId });
  const displayProducts = products?.slice(0, 2) || [];

  const formatViewers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="group block">
      {/* Stream Card */}
      <Link to={`/stream/${id}`}>
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

      {/* Products Section */}
      {userId && (
        <div className="mt-3 p-3 rounded-lg bg-card/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Shop</span>
            </div>
            <Link 
              to="/shop" 
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View Store
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex gap-2">
              <Skeleton className="w-12 h-12 rounded-md" />
              <Skeleton className="w-12 h-12 rounded-md" />
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="flex gap-2">
              {displayProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/shop/${product.id}`}
                  className="relative group/product"
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary border border-border hover:border-primary transition-colors">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 px-1 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded">
                    ${product.sale_price || product.price}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No products available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamCardWithProducts;
