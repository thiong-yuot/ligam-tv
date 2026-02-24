import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Trash2, ShoppingBag, GraduationCap, Briefcase, Loader2 } from "lucide-react";
import { useMyProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useCreatorCourses, useDeleteCourse } from "@/hooks/useCourses";
import { useMyFreelancerServices, useDeleteService } from "@/hooks/useFreelancerProfile";
import { toast } from "sonner";

const MyContentManager = () => {
  const { data: products = [], isLoading: productsLoading } = useMyProducts();
  const { data: courses = [], isLoading: coursesLoading } = useCreatorCourses();
  const { data: services = [], isLoading: servicesLoading } = useMyFreelancerServices();

  const deleteProduct = useDeleteProduct();
  const deleteCourse = useDeleteCourse();
  const deleteService = useDeleteService();

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "product") {
        await deleteProduct.mutateAsync(deleteTarget.id);
      } else if (deleteTarget.type === "course") {
        await deleteCourse.mutateAsync(deleteTarget.id);
      } else if (deleteTarget.type === "service") {
        await deleteService.mutateAsync(deleteTarget.id);
      }
      toast.success(`${deleteTarget.type.charAt(0).toUpperCase() + deleteTarget.type.slice(1)} deleted`);
    } catch {
      toast.error(`Failed to delete ${deleteTarget.type}`);
    }
    setDeleteTarget(null);
  };

  const isDeleting = deleteProduct.isPending || deleteCourse.isPending || deleteService.isPending;
  const totalItems = products.length + courses.length + services.length;

  if (totalItems === 0 && !productsLoading && !coursesLoading && !servicesLoading) {
    return null;
  }

  return (
    <>
      <Card className="p-6 bg-card border-border mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">My Content</h2>

        <Tabs defaultValue={products.length > 0 ? "products" : courses.length > 0 ? "courses" : "services"}>
          <TabsList className="mb-4">
            {products.length > 0 && (
              <TabsTrigger value="products">
                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                Products ({products.length})
              </TabsTrigger>
            )}
            {courses.length > 0 && (
              <TabsTrigger value="courses">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                Courses ({courses.length})
              </TabsTrigger>
            )}
            {services.length > 0 && (
              <TabsTrigger value="services">
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                Services ({services.length})
              </TabsTrigger>
            )}
          </TabsList>

          {products.length > 0 && (
            <TabsContent value="products" className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">${p.price}{p.sale_price ? ` → $${p.sale_price}` : ""}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => setDeleteTarget({ type: "product", id: p.id, name: p.name })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          )}

          {courses.length > 0 && (
            <TabsContent value="courses" className="space-y-2">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{c.title}</p>
                      {!c.is_published && <Badge variant="outline" className="text-[10px] px-1.5">Draft</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{c.price > 0 ? `$${c.price}` : "Free"} • {c.total_enrollments} enrolled</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => setDeleteTarget({ type: "course", id: c.id, name: c.title })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          )}

          {services.length > 0 && (
            <TabsContent value="services" className="space-y-2">
              {services.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">${s.price} • {s.delivery_days || 7} days</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => setDeleteTarget({ type: "service", id: s.id, name: s.title })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyContentManager;
