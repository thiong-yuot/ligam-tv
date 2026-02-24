import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useSellerOrders, useUpdateSellerOrder, type SellerOrder } from "@/hooks/useSellerOrders";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ArrowLeft,
  QrCode,
  Truck,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  processing: { label: "Processing", icon: Package, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-primary/10 text-primary border-primary/20" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const generateTrackingNumber = () => {
  const prefix = "LGM";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const getQrUrl = (data: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;

const SellerOrders = () => {
  const { user } = useAuth();
  const { data: orders, isLoading } = useSellerOrders();
  const updateOrder = useUpdateSellerOrder();
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const labelRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to manage orders</h1>
          <Button asChild><Link to="/login">Sign In</Link></Button>
        </div>
      </Layout>
    );
  }

  const handleGenerateTracking = async (order: SellerOrder) => {
    const trackingNumber = generateTrackingNumber();
    try {
      await updateOrder.mutateAsync({ id: order.id, tracking_number: trackingNumber, status: "shipped" });
      toast.success(`Tracking number generated: ${trackingNumber}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  const handleSetTracking = async (orderId: string) => {
    if (!trackingInput.trim()) return;
    try {
      await updateOrder.mutateAsync({ id: orderId, tracking_number: trackingInput.trim(), status: "shipped" });
      toast.success("Tracking number saved");
      setTrackingInput("");
    } catch {
      toast.error("Failed to update order");
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrder.mutateAsync({ id: orderId, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePrint = () => {
    if (!labelRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Shipping Label</title>
      <style>body{font-family:sans-serif;padding:24px}
      .label{border:2px solid #000;padding:24px;max-width:400px;margin:auto}
      .qr{text-align:center;margin:16px 0}
      h2{margin:0 0 8px}p{margin:4px 0;font-size:14px}
      .divider{border-top:1px dashed #999;margin:12px 0}
      </style></head><body>${labelRef.current.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const shipping = selectedOrder?.shipping_address;
  const buyerName = shipping?.name || selectedOrder?.buyer_profile?.display_name || "Buyer";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/seller/dashboard"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Orders</h1>
            <p className="text-sm text-muted-foreground">Track and fulfill customer orders</p>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-20" /></CardContent></Card>
            ))}
          </div>
        )}

        {!isLoading && (!orders || orders.length === 0) && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground">Orders for your products will appear here.</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const product = order.product;
              const isPhysical = product?.product_type === "physical" || !product?.product_type;

              return (
                <Card key={order.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        {product?.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-foreground text-sm truncate">{product?.name || "Product"}</h3>
                          <Badge variant="outline" className={`flex-shrink-0 gap-1 text-[10px] ${status.className}`}>
                            <StatusIcon className="w-3 h-3" />{status.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {order.quantity} · ${order.total_amount.toFixed(2)} · {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Buyer: {order.buyer_profile?.display_name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {isPhysical && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
                        <Select defaultValue={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                          <SelectTrigger className="h-8 text-xs w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        {order.tracking_number ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-primary font-mono">{order.tracking_number}</span>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setSelectedOrder(order)}>
                              <QrCode className="w-3 h-3" /> Label
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Input
                              placeholder="Tracking #"
                              className="h-8 text-xs w-[140px]"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSetTracking(order.id)}
                            />
                            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleSetTracking(order.id)}>
                              Save
                            </Button>
                            <Button size="sm" className="h-8 text-xs gap-1" onClick={() => handleGenerateTracking(order)}>
                              <QrCode className="w-3 h-3" /> Generate
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Shipping Label Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Truck className="w-4 h-4" /> Shipping Label
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div ref={labelRef}>
                <div className="label border-2 border-foreground/20 rounded-lg p-5 space-y-3">
                  <div className="text-center">
                    <h2 className="font-bold text-lg text-foreground">SHIP TO</h2>
                  </div>
                  <div className="space-y-1 text-sm text-foreground">
                    <p className="font-semibold">{buyerName}</p>
                    {shipping?.address && <p>{shipping.address}</p>}
                    {(shipping?.city || shipping?.state || shipping?.zip) && (
                      <p>{[shipping?.city, shipping?.state, shipping?.zip].filter(Boolean).join(", ")}</p>
                    )}
                    {shipping?.country && <p>{shipping.country}</p>}
                  </div>
                  <div className="border-t border-dashed border-foreground/20 pt-3">
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="text-sm font-medium text-foreground">{selectedOrder.product?.name} × {selectedOrder.quantity}</p>
                  </div>
                  <div className="border-t border-dashed border-foreground/20 pt-3">
                    <p className="text-xs text-muted-foreground">Tracking Number</p>
                    <p className="text-sm font-mono font-bold text-foreground">{selectedOrder.tracking_number}</p>
                  </div>
                  <div className="qr flex justify-center pt-2">
                    <img
                      src={getQrUrl(selectedOrder.tracking_number || "")}
                      alt="Tracking QR Code"
                      className="w-[150px] h-[150px]"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handlePrint} className="w-full gap-2">
                <Printer className="w-4 h-4" /> Print Label
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SellerOrders;
