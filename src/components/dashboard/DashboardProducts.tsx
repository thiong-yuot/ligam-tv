import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMyProducts, useDeleteProduct } from "@/hooks/useProducts";
import AddProductDialog from "@/components/AddProductDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Package, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DashboardProducts = () => {
  const { user } = useAuth();
  const { data: products, isLoading } = useMyProducts();
  const deleteProduct = useDeleteProduct();
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct.mutateAsync(productToDelete);
      toast.success("Product deleted");
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Your Products</p>
        <Button size="sm" onClick={() => setAddProductOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : products && products.length > 0 ? (
        <div className="space-y-1.5">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
              ) : (
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {product.sale_price ? (
                    <>
                      <span className="text-primary font-medium">${product.sale_price.toFixed(2)}</span>
                      <span className="line-through">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span>${product.price.toFixed(2)}</span>
                  )}
                  {product.category && <Badge variant="secondary" className="text-[10px] px-1.5">{product.category}</Badge>}
                </div>
              </div>
              <Badge variant={product.is_active ? "default" : "secondary"} className="text-[10px]">
                {product.is_active ? "Active" : "Inactive"}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => confirmDelete(product.id)}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-lg border border-border">
          <Package className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No products yet</p>
          <Button size="sm" onClick={() => setAddProductOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Your First Product
          </Button>
        </div>
      )}

      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardProducts;
