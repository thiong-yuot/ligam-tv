import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSellerProfile } from "@/hooks/useCreatorProfile";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/hooks/useProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSheet from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  MessageSquare,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Loader2,
  Store,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, totalItems } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });

  const { data: sellerProfile } = useSellerProfile(product?.seller_id || undefined);

  // Collect all images
  const allImages: string[] = [];
  if (product?.image_url) allImages.push(product.image_url);
  if ((product as any)?.additional_images) {
    allImages.push(...((product as any).additional_images as string[]));
  }

  const hasDiscount = product && product.sale_price !== null && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product!.price - product!.sale_price!) / product!.price) * 100)
    : 0;
  const displayPrice = product ? (product.sale_price ?? product.price) : 0;

  const isDigitalOrUnlimited = product && (product.stock_quantity === null || product.stock_quantity < 0);
  const isOutOfStock = product && !isDigitalOrUnlimited && product.stock_quantity === 0;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleDM = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!sellerProfile?.user_id) return;
    navigate(`/messages?to=${sellerProfile.user_id}`);
  };

  const nextImage = () => {
    setSelectedImageIndex((i) => (i + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((i) => (i - 1 + allImages.length) % allImages.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-32">
          <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Product not found</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/shop")}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-6 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => navigate("/shop")}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Shop
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                {hasDiscount && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={cn(
                        "w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        i === selectedImageIndex ? "border-primary" : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                {product.category && (
                  <p className="text-xs text-muted-foreground mb-1 capitalize">{product.category}</p>
                )}
                <h1 className="text-xl font-display font-bold text-foreground">{product.name}</h1>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">${displayPrice.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                )}
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              )}

              {isOutOfStock ? (
                <Badge variant="outline" className="text-xs">Sold Out</Badge>
              ) : (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4 mr-1.5" />
                    Add to Cart
                  </Button>
                  <CartSheet
                    trigger={
                      <Button variant="outline" size="icon" className="relative">
                        <ShoppingCart className="w-4 h-4" />
                        {totalItems > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                            {totalItems}
                          </Badge>
                        )}
                      </Button>
                    }
                  />
                </div>
              )}

              <Separator />

              {/* Seller Info */}
              <div className="rounded-xl border border-border p-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sold by</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={sellerProfile?.username ? `/user/${sellerProfile.username}` : "#"}
                      className="flex items-center gap-1 hover:underline"
                    >
                      <span className="text-sm font-medium text-foreground truncate">
                        {sellerProfile?.display_name || sellerProfile?.username || "Ligam Store"}
                      </span>
                      {sellerProfile?.is_verified && <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                    </Link>
                    {sellerProfile?.bio && (
                      <p className="text-xs text-muted-foreground truncate">{sellerProfile.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      if (sellerProfile?.username) navigate(`/user/${sellerProfile.username}`);
                    }}
                  >
                    <Store className="w-3.5 h-3.5 mr-1" />
                    View Profile
                  </Button>
                  {product.seller_id && product.seller_id !== user?.id && (
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleDM}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Message
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
