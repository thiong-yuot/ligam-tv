import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const MarketplacePreview = () => {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 2);

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Shop</h2>
            <p className="text-muted-foreground mt-1">Products from creators you love.</p>
          </div>
          <Link to="/shop">
            <Button variant="outline" size="sm" className="group">
              Browse Shop
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Link
                key={product.id}
                to="/shop"
                className="group bg-card border border-border rounded-xl p-4 hover:border-muted-foreground/30 transition-colors"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-foreground text-sm truncate">{product.name}</h4>
                <div className="mt-1">
                  {product.sale_price ? (
                    <span className="text-primary font-bold text-sm">${product.sale_price.toFixed(2)}</span>
                  ) : (
                    <span className="text-primary font-bold text-sm">${product.price.toFixed(2)}</span>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-card border border-border rounded-xl">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No products yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;
