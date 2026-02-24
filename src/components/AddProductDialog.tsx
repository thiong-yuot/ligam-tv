import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  Monitor,
  Box,
  Plus,
  Check,
  Image as ImageIcon,
  FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

const MIN_PHYSICAL_IMAGES = 3;

const AddProductDialog = ({ open, onOpenChange }: AddProductDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { canAddProduct, getMaxProducts, isLoading: featureLoading } = useFeatureAccess();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);
  const digitalFileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stockQuantity, setStockQuantity] = useState("999");
  const [productType, setProductType] = useState<"digital" | "physical">("digital");
  const [additionalImages, setAdditionalImages] = useState<{ url: string; preview: string }[]>([]);
  const [additionalUploading, setAdditionalUploading] = useState(false);
  const [digitalFilePath, setDigitalFilePath] = useState("");
  const [digitalFileName, setDigitalFileName] = useState("");
  const [digitalFileUploading, setDigitalFileUploading] = useState(false);

  const maxProducts = getMaxProducts();
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
    setProductType("digital");
    setAdditionalImages([]);
    setDigitalFilePath("");
    setDigitalFileName("");
  };

  const uploadImage = async (file: File): Promise<{ url: string; preview: string } | null> => {
    if (!user) return null;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return null;
    }

    const preview = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { data, error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) throw error;

    const { data: urlData, error: signedUrlError } = await supabase.storage
      .from("product-images")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365);
    if (signedUrlError) throw signedUrlError;

    return { url: urlData.signedUrl, preview };
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (result) {
        setImageUrl(result.url);
        setImagePreview(result.preview);
        toast.success("Image uploaded");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdditionalUploading(true);
    try {
      const result = await uploadImage(file);
      if (result) {
        setAdditionalImages(prev => [...prev, result]);
        toast.success("Image uploaded");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setAdditionalUploading(false);
      if (additionalInputRef.current) additionalInputRef.current.value = "";
    }
  };

  const removeMainImage = () => {
    setImageUrl("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDigitalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File must be less than 50MB");
      return;
    }
    setDigitalFileUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from("digital-products").upload(filePath, file);
      if (error) throw error;
      setDigitalFilePath(filePath);
      setDigitalFileName(file.name);
      toast.success("File uploaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload file");
    } finally {
      setDigitalFileUploading(false);
    }
  };

  const removeDigitalFile = () => {
    setDigitalFilePath("");
    setDigitalFileName("");
    if (digitalFileInputRef.current) digitalFileInputRef.current.value = "";
  };

  const totalImages = (imageUrl ? 1 : 0) + additionalImages.length;
  const physicalImagesValid = productType === "physical" ? totalImages >= MIN_PHYSICAL_IMAGES : true;
  const digitalImageValid = productType === "digital" ? !!imageUrl : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please log in"); return; }
    if (!canAdd) { toast.error(`Product limit reached for your plan.`); return; }
    if (!name.trim() || !price) { toast.error("Name and price are required"); return; }
    if (!category) { toast.error("Please select a category"); return; }
    if (!digitalImageValid) { toast.error("Please upload a product image"); return; }
    if (!physicalImagesValid) { toast.error(`Physical products require at least ${MIN_PHYSICAL_IMAGES} images`); return; }

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
        product_type: productType,
        additional_images: additionalImages.map(img => img.url),
        digital_file_url: productType === "digital" && digitalFilePath ? digitalFilePath : null,
      } as any);

      if (error) throw error;

      toast.success("Product added successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
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

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-5 pr-4">
            {/* Product Type */}
            <div className="space-y-2">
              <Label>Product Type *</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProductType("digital")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left",
                    productType === "digital"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <Monitor className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Digital</span>
                    <p className="text-[10px] text-muted-foreground">1 image required</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setProductType("physical")}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left",
                    productType === "physical"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-muted-foreground/50"
                  )}
                >
                  <Box className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium">Physical</span>
                    <p className="text-[10px] text-muted-foreground">{MIN_PHYSICAL_IMAGES}+ images required</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Main Image Upload */}
            <div className="space-y-2">
              <Label>Main Image *</Label>
              <div
                onClick={() => !isUploading && canAdd && fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl transition-all",
                  canAdd ? "cursor-pointer hover:border-primary hover:bg-primary/5" : "opacity-50 cursor-not-allowed",
                  imagePreview ? "border-primary bg-primary/5" : "border-border",
                  isUploading && "opacity-50 cursor-wait"
                )}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" disabled={!canAdd} />
                {imagePreview ? (
                  <div className="relative aspect-video">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeMainImage(); }} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 px-4">
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <Upload className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-xs font-medium">Click to upload</p>
                        <p className="text-[10px] text-muted-foreground">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images (for physical products) */}
            {productType === "physical" && (
              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  <span>Additional Images</span>
                  <span className={cn("text-xs", totalImages >= MIN_PHYSICAL_IMAGES ? "text-green-500" : "text-destructive")}>
                    {totalImages}/{MIN_PHYSICAL_IMAGES} minimum
                  </span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {additionalImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={img.preview} alt={`Image ${i + 2}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeAdditionalImage(i)} className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 hover:bg-background">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => additionalInputRef.current?.click()}
                    disabled={additionalUploading}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center transition-all"
                  >
                    {additionalUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-0.5">Add</span>
                      </>
                    )}
                  </button>
                </div>
                <input ref={additionalInputRef} type="file" accept="image/*" onChange={handleAdditionalImageUpload} className="hidden" />
                {!physicalImagesValid && (
                  <p className="text-xs text-destructive">Upload at least {MIN_PHYSICAL_IMAGES} images total for physical products</p>
                )}
              </div>
            )}

            {/* Digital File Upload */}
            {productType === "digital" && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5" />
                  Downloadable File
                </Label>
                <p className="text-xs text-muted-foreground">Upload the file buyers will receive after purchase (max 50MB)</p>
                {digitalFileName ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-secondary/50">
                    <FileDown className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{digitalFileName}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={removeDigitalFile}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => digitalFileInputRef.current?.click()}
                    disabled={digitalFileUploading}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {digitalFileUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload file (ZIP, PDF, etc.)</span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={digitalFileInputRef}
                  type="file"
                  onChange={handleDigitalFileUpload}
                  className="hidden"
                  accept=".zip,.rar,.pdf,.png,.jpg,.jpeg,.mp3,.wav,.mp4,.psd,.ai,.eps,.svg,.ttf,.otf,.woff,.woff2"
                />
              </div>
            )}

            {/* Category Selection */}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Neon Stream Overlay Pack" required disabled={!canAdd} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product..." rows={3} disabled={!canAdd} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="9.99" required disabled={!canAdd} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input id="salePrice" type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Optional" disabled={!canAdd} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input id="stockQuantity" type="number" min="0" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} placeholder="999" disabled={!canAdd} />
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t border-border mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-product-form"
            disabled={isLoading || isUploading || additionalUploading || !canAdd || !digitalImageValid || !physicalImagesValid}
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
