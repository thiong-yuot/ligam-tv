import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";

interface PackageFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    delivery_days: number;
    revisions: number;
    features: string[];
    is_popular: boolean;
  };
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    delivery_days: number;
    revisions: number;
    features: string[];
    is_popular: boolean;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  tier?: "basic" | "standard" | "premium";
}

export const PackageForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  tier = "basic",
}: PackageFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || (tier === "basic" ? "Basic" : tier === "standard" ? "Standard" : "Premium"),
    description: initialData?.description || "",
    price: initialData?.price || (tier === "basic" ? 50 : tier === "standard" ? 100 : 200),
    delivery_days: initialData?.delivery_days || (tier === "basic" ? 7 : tier === "standard" ? 5 : 3),
    revisions: initialData?.revisions || (tier === "basic" ? 1 : tier === "standard" ? 3 : 5),
    features: initialData?.features || [],
    is_popular: initialData?.is_popular || tier === "standard",
  });

  const [newFeature, setNewFeature] = useState("");

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{tier} Package</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="What's included in this package..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_days">Delivery (days)</Label>
              <Input
                id="delivery_days"
                type="number"
                min="1"
                value={formData.delivery_days}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    delivery_days: Number(e.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revisions">Revisions</Label>
              <Input
                id="revisions"
                type="number"
                min="0"
                value={formData.revisions}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    revisions: Number(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button type="button" onClick={addFeature} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="gap-1">
                  {feature}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_popular"
              checked={formData.is_popular}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_popular: checked }))
              }
            />
            <Label htmlFor="is_popular">Mark as Popular</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Package"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
