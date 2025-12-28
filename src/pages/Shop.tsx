import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Star, Filter, Heart, Loader2 } from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import CartSheet from "@/components/CartSheet";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: products, isLoading, error } = useProducts();
  const { addToCart, totalItems } = useCart();

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (!products) return ["All"];
    const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <ShoppingCart className="w-4 h-4" />
            Official Shop
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Level Up Your <span className="text-primary">Stream</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Premium overlays, alerts, emotes, and gear to make your stream stand out.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>

          {/* Cart Button */}
          <div className="mt-6">
            <CartSheet
              trigger={
                <Button variant="outline" className="relative gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 border-y border-border bg-card/30">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category as string)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h2>
            <span className="text-muted-foreground">
              {filteredProducts.length} products
            </span>
          </div>

          {error && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-destructive mb-2">
                Error loading products
              </h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          )}

          {isLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-24" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
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
                    {product.sale_price && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                        Sale
                      </Badge>
                    )}
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <Badge className="absolute top-3 left-3 bg-warning text-warning-foreground">
                        Low Stock
                      </Badge>
                    )}
                    {product.stock_quantity === 0 && (
                      <Badge className="absolute top-3 left-3 bg-muted text-muted-foreground">
                        Out of Stock
                      </Badge>
                    )}
                    <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
                      <Heart className="w-5 h-5 text-foreground" />
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">
                          ${(product.sale_price ?? product.price).toFixed(2)}
                        </span>
                        {product.sale_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                      >
                        {product.stock_quantity === 0 ? "Sold Out" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Sell Your Creations
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Are you a designer? List your overlays, emotes, and more on the Ligam marketplace.
          </p>
          <Button variant="default" size="lg" className="glow">
            Become a Seller
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
