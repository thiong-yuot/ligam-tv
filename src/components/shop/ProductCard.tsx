import { Heart, ShoppingCart, Eye, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Product } from "@/hooks/useProducts";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ product, onAddToCart, viewMode = "grid" }: ProductCardProps) => {
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;
  const displayPrice = product.sale_price ?? product.price;
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  // Mock seller data - in real app this would come from product.seller
  const seller = {
    name: "Ligam Store",
    verified: true,
    avatar: null,
  };

  // Mock rating - in real app this would come from product.rating
  const rating = 4.5;
  const reviewCount = 128;

  if (viewMode === "list") {
    return (
      <div className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative w-48 h-36 flex-shrink-0 rounded-lg overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
              -{discountPercent}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">{product.category}</span>
              {seller.verified && (
                <CheckCircle className="w-3 h-3 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onAddToCart(product)}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discountPercent}%
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-warning text-warning">
              Low Stock
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background hover:text-primary transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background hover:text-primary transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            className="w-full"
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">L</span>
          </div>
          <span className="text-xs text-muted-foreground">{seller.name}</span>
          {seller.verified && (
            <CheckCircle className="w-3 h-3 text-primary" />
          )}
        </div>

        {/* Category */}
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>

        {/* Title */}
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-3.5 h-3.5",
                  star <= Math.floor(rating)
                    ? "fill-primary text-primary"
                    : star <= rating
                    ? "fill-primary/50 text-primary"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-primary">
            ${displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
