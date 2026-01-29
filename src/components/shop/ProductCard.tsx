import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Product } from "@/hooks/useProducts";
import { useSellerProfile } from "@/hooks/useCreatorProfile";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ product, onAddToCart, viewMode = "grid" }: ProductCardProps) => {
  const navigate = useNavigate();
  const { data: sellerProfile } = useSellerProfile(product.seller_id || undefined);
  
  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sellerProfile?.username) {
      navigate(`/@${sellerProfile.username}`);
    }
  };
  
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;
  const displayPrice = product.sale_price ?? product.price;
  // -1 means unlimited stock (digital products), null also means available
  const isDigitalOrUnlimited = product.stock_quantity === null || product.stock_quantity < 0;
  const isOutOfStock = !isDigitalOrUnlimited && product.stock_quantity === 0;
  const isLowStock = !isDigitalOrUnlimited && product.stock_quantity > 0 && product.stock_quantity <= 5;

  // Use real seller data from profile or fallback
  const seller = {
    name: sellerProfile?.display_name || sellerProfile?.username || "Ligam Store",
    verified: sellerProfile?.is_verified || false,
    avatar: sellerProfile?.avatar_url || null,
  };

  // Mock sold count - in real app this would come from orders
  const soldCount = 128;

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
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{soldCount} sold</span>
              </div>
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
    <div className="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-300">
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
        <div 
          className={`flex items-center gap-2 mb-2 ${sellerProfile?.username ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''}`}
          onClick={sellerProfile?.username ? handleSellerClick : undefined}
        >
          <Avatar className="w-5 h-5">
            <AvatarImage src={seller.avatar || undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
              {seller.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={`text-xs text-muted-foreground truncate ${sellerProfile?.username ? 'hover:text-primary' : ''}`}>
            {seller.name}
          </span>
          {seller.verified && (
            <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
          )}
        </div>

        {/* Category */}
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>

        {/* Title */}
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Sales count */}
        <div className="flex items-center gap-1.5 mt-2">
          <Package className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">{soldCount} sold</span>
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
