import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  useMyFreelancerProfile,
  useMyFreelancerServices,
  useDeleteService,
} from "@/hooks/useFreelancerProfile";
import {
  useFreelancerPackages,
  useFreelancerIncomingOrders,
  useUpdateFreelancerOrder,
} from "@/hooks/useFreelancerPackages";
import BecomeFreelancerDialog from "@/components/BecomeFreelancerDialog";
import AddServiceDialog from "@/components/AddServiceDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase, Plus, Star, DollarSign, Clock, Trash2, Loader2,
  Package, ShoppingBag, RefreshCw, Check, CheckCircle2, XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const DashboardFreelance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyFreelancerProfile();
  const { data: services = [] } = useMyFreelancerServices();
  const { data: packages = [] } = useFreelancerPackages(profile?.id || "");
  const { data: orders = [], isLoading: ordersLoading } = useFreelancerIncomingOrders(profile?.id || "");
  const deleteService = useDeleteService();
  const updateOrder = useUpdateFreelancerOrder();

  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [becomeFreelancerOpen, setBecomeFreelancerOpen] = useState(false);

  if (profileLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 rounded-lg border border-border">
        <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-3">You haven't set up a freelance profile yet</p>
        <Button size="sm" onClick={() => setBecomeFreelancerOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Become a Freelancer
        </Button>
        <BecomeFreelancerDialog open={becomeFreelancerOpen} onOpenChange={setBecomeFreelancerOpen} />
      </div>
    );
  }

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updateData: { status: string; completed_at?: string } = { status: newStatus };
      if (newStatus === "completed") updateData.completed_at = new Date().toISOString();
      await updateOrder.mutateAsync({ id: orderId, ...updateData });
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "in_progress": return <Badge className="bg-primary text-primary-foreground"><RefreshCw className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "completed": return <Badge className="bg-primary text-primary-foreground"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case "cancelled": return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingOrders = orders.filter(o => o.status === "pending");
  const activeOrders = orders.filter(o => o.status === "in_progress");

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Rating", value: profile.rating?.toFixed(1) || "0.0", icon: Star },
          { label: "Jobs Done", value: profile.total_jobs || 0, icon: Briefcase },
          { label: "Packages", value: packages.length, icon: Package },
          { label: "Active Orders", value: activeOrders.length, icon: ShoppingBag },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-3 text-center">
            <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-base font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-tabs for freelance sections */}
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders" className="relative text-xs">
            Orders
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                {pendingOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="packages" className="text-xs">Packages ({packages.length})</TabsTrigger>
          <TabsTrigger value="services" className="text-xs">Services ({services.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-2 mt-3">
          {ordersLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-6 rounded-lg border border-border">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-bold text-primary">${order.total_amount}</p>
                </div>
                <p className="text-sm font-medium">{order.package?.name || "Custom Order"}</p>
                {order.requirements && <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded">{order.requirements}</p>}
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <>
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleOrderStatusChange(order.id, "in_progress")}>
                        <Check className="w-3 h-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleOrderStatusChange(order.id, "cancelled")}>
                        Decline
                      </Button>
                    </>
                  )}
                  {order.status === "in_progress" && (
                    <Button size="sm" className="h-7 text-xs" onClick={() => handleOrderStatusChange(order.id, "completed")}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="packages" className="space-y-2 mt-3">
          {packages.length === 0 ? (
            <div className="text-center py-6 rounded-lg border border-border">
              <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No packages yet</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{pkg.name}</p>
                    {pkg.is_popular && <Badge className="text-[10px] px-1.5">Popular</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">${pkg.price}</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{pkg.delivery_days}d</span>
                    <span className="flex items-center gap-0.5"><RefreshCw className="w-3 h-3" />{pkg.revisions} rev</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-2 mt-3">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setAddServiceOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Service
            </Button>
          </div>
          {services.length === 0 ? (
            <div className="text-center py-6 rounded-lg border border-border">
              <Briefcase className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No services yet</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{service.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" />{service.price}</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{service.delivery_days || 7}d</span>
                    {service.category && <Badge variant="secondary" className="text-[10px] px-1.5">{service.category}</Badge>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteService(service.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          )}
          <AddServiceDialog open={addServiceOpen} onOpenChange={setAddServiceOpen} freelancerId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardFreelance;
