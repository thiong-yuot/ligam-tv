import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ExternalLink } from "lucide-react";

const FeaturedProductsWidget = ({ 
  products, 
  creatorUsername,
  maxItems = 3 
}) => {
  const displayProducts = products.slice(0, maxItems);

  if (displayProducts.length === 0) return null;

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Featured Products</h3>
        </div>
        {creatorUsername && (
          <Link to={`/${creatorUsername}/store`}>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              View Store
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        )}
      </div>
      
      <div className="space-y-3">
        {displayProducts.map((product) => (
          <Link 
            key={product.id} 
            to={`/shop/${product.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {product.name}
              </p>
              <div className="flex items-center gap-2">
                {product.sale_price ? (
                  <>
                    <span className="text-sm font-bold text-primary">
                      ${product.sale_price.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default FeaturedProductsWidget;
