import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { productSchema, validateOrThrow } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Loader2,
  Upload,
  X,
  Gamepad2,
  Music,
  Palette,
  Video,
  Sparkles,
  Bell,
  Layout,
  Layers,
  Volume2,
  MoreHorizontal,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "overlays", name: "Overlays", icon: Layers, color: "bg-primary/20 text-primary border-primary/30" },
  { id: "emotes", name: "Emotes", icon: Sparkles, color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: "alerts", name: "Alerts", icon: Bell, color: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: "panels", name: "Panels", icon: Layout, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: "transitions", name: "Transitions", icon: Video, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { id: "sounds", name: "Sounds", icon: Volume2, color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: "music", name: "Music", icon: Music, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
  { id: "art", name: "Art & Design", icon: Palette, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { id: "other", name: "Other", icon: MoreHorizontal, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
];

const AddProductDialog = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { canAddProduct, getMaxProducts, getCurrentProductCount, getRemainingProducts, tier, getUpgradeMessage, isLoading: featureLoading } = useFeatureAccess();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("999");

  const maxProducts = getMaxProducts();
  const currentCount = getCurrentProductCount();
  const remainingSlots = getRemainingProducts();
  const canAdd = featureLoading ? true : canAddProduct();

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSalePrice("");
    setCategory("");
    setImageUrl("");
    setImagePreview(null);
    setStockQuantity("999");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result);
      reader.readAsDataURL(file);

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData, error: signedUrlError } = await supabase.storage
        .from("product-images")
        .createSignedUrl(data.path, 60 * 60 * 24 * 365);

      if (signedUrlError) throw signedUrlError;

      setImageUrl(urlData.signedUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to add products");
      return;
    }

    if (!canAdd) {
      toast.error(`You've reached the maximum of ${maxProducts} products for your plan. Upgrade to add more!`);
      return;
    }

    if (!name.trim() || !price) {
      toast.error("Name and price are required");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);

    try {
      const validated = validateOrThrow(productSchema, {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        category,
        image_url: imageUrl || null,
        stock_quantity: parseInt(stockQuantity) || 999,
      });

      const { error } = await supabase.from("products").insert({
        name: validated.name,
        description: validated.description,
        price: validated.price,
        sale_price: validated.sale_price,
        category: validated.category,
        image_url: validated.image_url,
        stock_quantity: validated.stock_quantity,
        seller_id: user.id,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Product added successfully!", {
        action: {
          label: "View Dashboard",
          onClick: () => navigate("/seller/dashboard"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Add New Product
          </DialogTitle>
          <DialogDescription>
            List a new product on the marketplace.
          </DialogDescription>
        </DialogHeader>

        {maxProducts !== Infinity && (
          <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span>
                {currentCount} / {maxProducts} products used
              </span>
            </div>
            {remainingSlots > 0 ? (
              <span className="text-muted-foreground">
                {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} remaining
              </span>
            ) : (
              <Link to="/pricing">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        )}

        {!canAdd && (
          <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Product Limit Reached</AlertTitle>
            <AlertDescription>
              {getUpgradeMessage("product")}
              <Link to="/pricing" className="block mt-2">
                <Button size="sm" variant="outline">
                  View Plans
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-5 pr-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div
                onClick={() => !isUploading && canAdd && fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl transition-all",
                  canAdd ? "cursor-pointer hover:border-primary hover:bg-primary/5" : "opacity-50 cursor-not-allowed",
                  imagePreview ? "border-primary bg-primary/5" : "border-border",
                  isUploading && "opacity-50 cursor-wait"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={!canAdd}
                />
                
                {imagePreview ? (
                  <div className="relative aspect-video">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    {isUploading ? (
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => canAdd && setCategory(cat.id)}
                      disabled={!canAdd}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                        !canAdd && "opacity-50 cursor-not-allowed",
                        isSelected
                          ? cn(cat.color, "border-2")
                          : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
              {selectedCategory && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: <span className="font-medium">{selectedCategory.name}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Neon Stream Overlay Pack"
                required
                disabled={!canAdd}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                rows={3}
                disabled={!canAdd}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9.99"
                  required
                  disabled={!canAdd}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Optional"
                  disabled={!canAdd}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="999"
                disabled={!canAdd}
              />
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t border-border mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-product-form"
            disabled={isLoading || isUploading || !canAdd}
            className="flex-1 glow"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {canAdd ? "Add Product" : "Limit Reached"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
