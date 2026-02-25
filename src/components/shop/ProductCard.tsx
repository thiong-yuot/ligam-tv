import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      navigate(`/user/${sellerProfile.username}`);
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
      <div className="group flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-all duration-300">
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
    <div className="group relative rounded-lg bg-card border border-border overflow-hidden hover:border-muted-foreground/30 transition-all duration-300">
      <div className="relative aspect-[3/2] overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5">-{discountPercent}%</Badge>
        )}
        {isOutOfStock && (
          <Badge variant="outline" className="absolute top-2 left-2 bg-background/80 text-[10px] px-1.5 py-0.5">Sold Out</Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button className="w-full h-7 text-xs" size="sm" onClick={() => onAddToCart(product)} disabled={isOutOfStock}>
            <ShoppingCart className="w-3 h-3 mr-1" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{product.category}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs font-bold text-primary">${displayPrice.toFixed(2)}</span>
          {hasDiscount && <span className="text-[10px] text-muted-foreground line-through">${product.price.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
