import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddProductDialog from "@/components/AddProductDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Package,
  Plus,
  DollarSign,
  ShoppingBag,
  Trash2,
  Edit,
  Store,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: products, isLoading } = useMyProducts();
  const deleteProduct = useDeleteProduct();
  const { getMaxProducts, canAddProduct, tier } = useFeatureAccess();
  
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const maxProducts = getMaxProducts();
  const currentProductCount = products?.length || 0;
  const canAdd = canAddProduct(currentProductCount);
  const productLimitPercent = maxProducts === Infinity ? 0 : (currentProductCount / maxProducts) * 100;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const totalProducts = products?.length || 0;
  const totalValue = products?.reduce((sum, p) => sum + (p.sale_price || p.price), 0) || 0;

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct.mutateAsync(productToDelete);
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Store className="h-8 w-8 text-primary" />
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your products and track sales
            </p>
          </div>
          {canAdd ? (
            <Button onClick={() => setAddProductOpen(true)} className="glow">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          ) : (
            <Link to="/pricing">
              <Button variant="outline" className="gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                Upgrade to Add More
              </Button>
            </Link>
          )}
        </div>

        {/* Product Limit Banner */}
        {maxProducts !== Infinity && (
          <Card className={`mb-8 ${!canAdd ? 'border-amber-500 bg-amber-500/5' : ''}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Product Limit</span>
                  {!canAdd && (
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Limit Reached
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentProductCount} / {maxProducts} products
                </span>
              </div>
              <Progress value={productLimitPercent} className="h-2" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {tier === null ? 'Free: 1 product' : tier === 'creator' ? 'Creator: 3 products' : 'Pro: Unlimited'}
                </p>
                {tier !== 'pro' && (
                  <Link to="/pricing" className="text-xs text-primary hover:underline">
                    Upgrade for more →
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              {maxProducts !== Infinity && (
                <p className="text-xs text-muted-foreground">{maxProducts - currentProductCount} slots remaining</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Portfolio Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">8% platform fee</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {product.sale_price ? (
                          <>
                            <span className="text-primary font-medium">
                              ${product.sale_price.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                        {product.category && (
                          <Badge variant="secondary">{product.category}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first product to the marketplace.
                </p>
                <Button onClick={() => setAddProductOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
