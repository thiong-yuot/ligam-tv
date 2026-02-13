import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import BecomeSellerDialog from "@/components/BecomeSellerDialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductCard from "@/components/shop/ProductCard";
import ShopHeader from "@/components/shop/ShopHeader";
import MobileFilters from "@/components/shop/MobileFilters";

type SortOption = "newest" | "price-low" | "price-high" | "popular" | "rating";
type ViewMode = "grid" | "list";

const Shop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [becomeSellerOpen, setBecomeSellerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const { data: products, isLoading, error } = useProducts();
  const { addToCart, totalItems } = useCart();

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  const categories = useMemo(() => {
    if (!products) return ["All"];
    const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...uniqueCategories];
  }, [products]);

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

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
        break;
      case "price-high":
        result = [...result].sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
        break;
      case "newest":
        result = [...result].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, priceRange, onSaleOnly, inStockOnly, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Simple Hero */}
      <section className="pt-24 pb-6 px-4 md:px-6 lg:px-8 bg-background border-b border-border">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Shop
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Discover products from creators worldwide.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => user ? navigate("/seller/dashboard") : setBecomeSellerOpen(true)}
          >
            <Store className="w-4 h-4 mr-2" />
            {user ? "Seller Dashboard" : "Become a Seller"}
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-6 pb-12">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
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

            <div className="flex-1 min-w-0">
              {error && (
                <div className="text-center py-20 rounded-xl bg-card border border-border">
                  <h3 className="text-xl font-semibold text-destructive mb-2">Error loading products</h3>
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
                      <Skeleton className="aspect-[4/3] w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-full" />
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
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
            </div>
          </div>
        </div>
      </main>

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
