import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Search, Loader2, Package } from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import BecomeSellerDialog from "@/components/BecomeSellerDialog";
import { toast } from "sonner";
import ProductCard from "@/components/shop/ProductCard";

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerFilter = searchParams.get("seller");
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [becomeSellerOpen, setBecomeSellerOpen] = useState(false);

  const { data: products, isLoading, error } = useProducts();
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;
    if (sellerFilter) {
      filtered = filtered.filter((p) => p.seller_id === sellerFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [products, searchQuery, sellerFilter]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-16 pb-4 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          <h1 className="text-lg font-display font-bold text-foreground">Shop</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-card"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => user ? navigate("/seller/dashboard") : setBecomeSellerOpen(true)}
            >
              <Store className="w-3.5 h-3.5 mr-1" />
              {user ? "Sell" : "Sell"}
            </Button>
          </div>
        </div>
      </section>

      <main className="px-4 md:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-[1920px] mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">Error loading products</p>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  viewMode="grid"
                />
              ))}
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No products found</p>
            </div>
          )}
        </div>
      </main>

      <BecomeSellerDialog open={becomeSellerOpen} onOpenChange={setBecomeSellerOpen} />
      <Footer />
    </div>
  );
};

export default Shop;
