import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, ArrowRight, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const MarketplacePreview = () => {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">Marketplace</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Shop Exclusive Products
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover unique products from creators and sellers. From digital goods to merchandise, 
              find everything in one place.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-500" />
                </div>
                <span>Thousands of unique products</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-500" />
                </div>
                <span>Verified sellers and reviews</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-green-500" />
                </div>
                <span>Secure checkout with Stripe</span>
              </li>
            </ul>

            <div className="flex gap-4 pt-4">
              <Link to="/shop">
                <Button size="lg" className="group">
                  Browse Shop
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/seller-dashboard">
                <Button variant="outline" size="lg">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Products Grid */}
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-muted rounded-lg mb-3" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to="/shop"
                  className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {product.sale_price ? (
                      <>
                        <span className="text-primary font-bold">${product.sale_price.toFixed(2)}</span>
                        <span className="text-muted-foreground text-sm line-through">${product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-card border border-border rounded-xl">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No products available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;
