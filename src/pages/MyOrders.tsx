import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useMyOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, ArrowLeft, Clock, CheckCircle, Truck, XCircle, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  processing: { label: "Processing", icon: Package, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-primary/10 text-primary border-primary/20" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const MyOrders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useMyOrders();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (productId: string) => {
    setDownloading(productId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke("download-digital-product", {
        body: { productId },
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.error) throw new Error(response.error.message);
      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view orders</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to see your purchase history.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/shop">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Purchases</h1>
            <p className="text-sm text-muted-foreground">View your order history and tracking</p>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!orders || orders.length === 0) && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">No purchases yet</h2>
              <p className="text-muted-foreground mb-6">When you buy something, your orders will appear here.</p>
              <Button asChild>
                <Link to="/shop">Browse Shop</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const product = (order as any).products;

              return (
                <Card key={order.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {product?.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {product?.name || "Product"}
                        </h3>
                        <Badge variant="outline" className={`flex-shrink-0 gap-1 ${status.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Qty: {order.quantity} · Total: <span className="font-medium text-foreground">${order.total_amount.toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ordered {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      {order.tracking_number && (
                        <div className="mt-2 flex items-center gap-3">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(order.tracking_number)}`}
                            alt="Tracking QR"
                            className="w-10 h-10"
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">Tracking</p>
                            <p className="text-xs text-primary font-mono font-medium">{order.tracking_number}</p>
                          </div>
                        </div>
                      )}
                      {/* Download button for digital products */}
                      {product?.product_type === "digital" && product?.digital_file_url && order.product_id && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1.5"
                            disabled={downloading === order.product_id}
                            onClick={() => handleDownload(order.product_id!)}
                          >
                            {downloading === order.product_id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Download className="w-3 h-3" />
                            )}
                            Download File
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyOrders;
