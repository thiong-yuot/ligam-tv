import { useMyOrders } from "@/hooks/useOrders";
import { useMyFreelancerOrders, useUpdateFreelancerOrder } from "@/hooks/useFreelancerPackages";
import { useEarningsSummary } from "@/hooks/useEarnings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, Briefcase, GraduationCap, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const useMyEnrollments = () => {
  return useQuery({
    queryKey: ["my-enrollments"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return [];
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(id, title, thumbnail_url, price)")
        .eq("user_id", session.session.user.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

const statusColor = (status: string) => {
  switch (status) {
    case "completed": case "delivered": return "default";
    case "pending": return "secondary";
    case "in_progress": case "processing": return "outline";
    case "cancelled": case "rejected": return "destructive";
    default: return "secondary";
  }
};

const DashboardOrders = () => {
  const { data: shopOrders = [], isLoading: loadingShop } = useMyOrders();
  const { data: freelanceOrders = [], isLoading: loadingFreelance } = useMyFreelancerOrders();
  const { data: enrollments = [], isLoading: loadingEnrollments } = useMyEnrollments();
  const { totalThisMonth, storeEarnings, serviceEarnings, courseEarnings } = useEarningsSummary();
  const updateOrder = useUpdateFreelancerOrder();

  const handleClientComplete = async (orderId: string) => {
    try {
      await updateOrder.mutateAsync({ id: orderId, client_completed: true });
      toast.success("Project confirmed complete! Payment will be released.");
    } catch {
      toast.error("Failed to confirm completion");
    }
  };

  const isLoading = loadingShop || loadingFreelance || loadingEnrollments;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: `$${totalThisMonth.toFixed(0)}`, icon: DollarSign },
          { label: "Shop", value: `$${storeEarnings.toFixed(0)}`, icon: ShoppingBag },
          { label: "Freelance", value: `$${serviceEarnings.toFixed(0)}`, icon: Briefcase },
          { label: "Courses", value: `$${courseEarnings.toFixed(0)}`, icon: GraduationCap },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border p-3 text-center">
            <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-base font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Shop Orders */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Shop Orders ({shopOrders.length})</p>
        </div>
        {shopOrders.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center border border-border rounded-lg">No shop orders yet</p>
        ) : (
          <div className="space-y-1.5">
            {shopOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {(order as any).products?.name || "Product Order"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${order.total_amount.toFixed(2)} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={statusColor(order.status)}>{order.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Freelance Orders */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Freelance Orders ({freelanceOrders.length})</p>
        </div>
        {freelanceOrders.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center border border-border rounded-lg">No freelance orders yet</p>
        ) : (
          <div className="space-y-1.5">
            {freelanceOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Briefcase className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {order.package?.name || "Service Order"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${order.total_amount.toFixed(2)} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={statusColor(order.status)}>{order.status}</Badge>
                {order.freelancer_completed && !order.client_completed && order.status === "in_progress" && (
                  <Button size="sm" className="h-6 text-[10px] px-2" onClick={() => handleClientComplete(order.id)}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Confirm Complete
                  </Button>
                )}
                {order.payment_released && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">💰 Released</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Enrollments */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary" />
          <p className="text-sm font-medium text-foreground">Course Enrollments ({enrollments.length})</p>
        </div>
        {enrollments.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center border border-border rounded-lg">No enrollments yet</p>
        ) : (
          <div className="space-y-1.5">
            {enrollments.slice(0, 5).map((enrollment: any) => (
              <div key={enrollment.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {enrollment.courses?.title || "Course"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {enrollment.progress_percentage || 0}% complete · {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={enrollment.is_completed ? "default" : "secondary"}>
                  {enrollment.is_completed ? "Completed" : "In Progress"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOrders;
