import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Users, TrendingUp } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import BecomeSellerDialog from "@/components/BecomeSellerDialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductCard from "@/components/shop/ProductCard";
import FeaturedCarousel from "@/components/shop/FeaturedCarousel";
import ShopHeader from "@/components/shop/ShopHeader";
import MobileFilters from "@/components/shop/MobileFilters";

const Shop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [becomeSellerOpen, setBecomeSellerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const { data: products, isLoading, error } = useProducts();
  const { addToCart, totalItems } = useCart();

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (!products) return ["All"];
    const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...uniqueCategories];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesSale = !onSaleOnly || (p.sale_price !== null && p.sale_price < p.price);
      const matchesStock = !inStockOnly || p.stock_quantity > 0;
      
      return matchesCategory && matchesSearch && matchesPrice && matchesSale && matchesStock;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => 
          (a.sale_price ?? a.price) - (b.sale_price ?? b.price)
        );
        break;
      case "price-high":
        result = [...result].sort((a, b) => 
          (b.sale_price ?? b.price) - (a.sale_price ?? a.price)
        );
        break;
      case "newest":
        result = [...result].sort((a, b) => 
          new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, priceRange, onSaleOnly, inStockOnly, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 pb-8 px-4 md:px-6 lg:px-8 bg-background border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-foreground text-sm font-medium mb-4">
                <Store className="w-4 h-4 text-primary" />
                Creator Marketplace
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Shop <span className="text-primary">Exclusive Products</span>
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Discover unique products from talented creators around the world.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => user ? navigate("/seller/dashboard") : setBecomeSellerOpen(true)}
              >
                <Store className="w-4 h-4 mr-2" />
                {user ? "Seller Dashboard" : "Become a Seller"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8 pb-12">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
          {/* Header with Search and Controls */}
          <ShopHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalItems={totalItems}
            productCount={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onMobileFilterClick={() => setMobileFiltersOpen(true)}
          />

          <div className="flex gap-8 mt-6">
            {/* Sidebar */}
            <ShopSidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              maxPrice={maxPrice}
              onSaleOnly={onSaleOnly}
              onSaleOnlyChange={setOnSaleOnly}
              inStockOnly={inStockOnly}
              onInStockOnlyChange={setInStockOnly}
            />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Featured Carousel */}
              <FeaturedCarousel />

              {/* Products Section */}
              <section className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {activeCategory === "All" ? "All Products" : activeCategory}
                  </h2>
                </div>

                {error && (
                  <div className="text-center py-20 rounded-xl bg-card border border-border">
                    <h3 className="text-xl font-semibold text-destructive mb-2">
                      Error loading products
                    </h3>
                    <p className="text-muted-foreground">Please try again later</p>
                  </div>
                )}

                {isLoading && (
                  <div className={viewMode === "grid" 
                    ? "grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }>
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <div className="p-4 space-y-3">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoading && !error && filteredProducts.length > 0 && (
                  <div className={viewMode === "grid" 
                    ? "grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}

                {!isLoading && !error && filteredProducts.length === 0 && (
                  <div className="text-center py-20 rounded-xl bg-card border border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveCategory("All");
                        setSearchQuery("");
                        setPriceRange([0, maxPrice]);
                        setOnSaleOnly(false);
                        setInStockOnly(false);
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30 border-t border-border">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-foreground text-sm font-medium mb-4">
              <Store className="w-4 h-4 text-primary" />
              Start Selling
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Sell Your Creations on Ligam
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join our growing community of sellers. List your products, connect with buyers worldwide, and grow your business.
            </p>
            <Button
              size="lg"
              className="glow"
              onClick={() => {
                if (user) {
                  navigate("/seller/dashboard");
                } else {
                  setBecomeSellerOpen(true);
                }
              }}
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Filters Sheet */}
      <MobileFilters
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        maxPrice={maxPrice}
        onSaleOnly={onSaleOnly}
        onSaleOnlyChange={setOnSaleOnly}
        inStockOnly={inStockOnly}
        onInStockOnlyChange={setInStockOnly}
      />

      <BecomeSellerDialog open={becomeSellerOpen} onOpenChange={setBecomeSellerOpen} />

      <Footer />
    </div>
  );
};

export default Shop;
