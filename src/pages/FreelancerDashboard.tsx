import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddServiceDialog from "@/components/AddServiceDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Plus,
  Star,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Loader2,
  X,
  ExternalLink,
  Package,
  ShoppingBag,
  RefreshCw,
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Image,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useMyFreelancerProfile,
  useMyFreelancerServices,
  useUpdateFreelancerProfile,
  useDeleteService,
} from "@/hooks/useFreelancerProfile";
import {
  useFreelancerPackages,
  useCreatePackage,
  useDeletePackage,
  useFreelancerIncomingOrders,
  useUpdateFreelancerOrder,
} from "@/hooks/useFreelancerPackages";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useMyFreelancerProfile();
  const { data: services = [], isLoading: servicesLoading } = useMyFreelancerServices();
  const updateProfile = useUpdateFreelancerProfile();
  const deleteService = useDeleteService();

  const { data: packages = [], isLoading: packagesLoading } = useFreelancerPackages(profile?.id || "");
  const { data: orders = [], isLoading: ordersLoading } = useFreelancerIncomingOrders(profile?.id || "");
  const createPackage = useCreatePackage();
  const deletePackage = useDeletePackage();
  const updateOrder = useUpdateFreelancerOrder();
  const { uploadFile, uploadMultipleFiles, uploading } = useFileUpload();
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addPackageOpen, setAddPackageOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    bio: "",
    hourly_rate: "",
    portfolio_url: "",
    skills: [] as string[],
    avatar_url: "",
    thumbnail_url: "",
    portfolio_images: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");
  
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    price: "",
    delivery_days: "7",
    revisions: "1",
    features: [] as string[],
    is_popular: false,
  });
  const [featureInput, setFeatureInput] = useState("");

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!profile) {
    navigate("/freelance");
    return null;
  }

  const startEditing = () => {
    setEditForm({
      name: profile.name,
      title: profile.title,
      bio: profile.bio || "",
      hourly_rate: profile.hourly_rate?.toString() || "",
      portfolio_url: profile.portfolio_url || "",
      skills: profile.skills || [],
      avatar_url: profile.avatar_url || "",
      thumbnail_url: profile.thumbnail_url || "",
      portfolio_images: profile.portfolio_images || [],
    });
    setIsEditing(true);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "freelancer-portfolios", user.id);
    if (url) setEditForm((prev) => ({ ...prev, avatar_url: url }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "freelancer-portfolios", user.id);
    if (url) setEditForm((prev) => ({ ...prev, thumbnail_url: url }));
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    const urls = await uploadMultipleFiles(Array.from(files), "freelancer-portfolios", user.id);
    setEditForm((prev) => ({
      ...prev,
      portfolio_images: [...prev.portfolio_images, ...urls],
    }));
  };

  const removePortfolioImage = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      portfolio_images: prev.portfolio_images.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !editForm.skills.includes(skillInput.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s) => s !== skill) });
  };

  const saveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: editForm.name,
        title: editForm.title,
        bio: editForm.bio || null,
        hourly_rate: editForm.hourly_rate ? parseFloat(editForm.hourly_rate) : null,
        portfolio_url: editForm.portfolio_url || null,
        skills: editForm.skills.length > 0 ? editForm.skills : null,
        avatar_url: editForm.avatar_url || null,
        thumbnail_url: editForm.thumbnail_url || null,
        portfolio_images: editForm.portfolio_images.length > 0 ? editForm.portfolio_images : null,
      });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const toggleAvailability = async () => {
    try {
      await updateProfile.mutateAsync({ is_available: !profile.is_available });
      toast.success(profile.is_available ? "You're now unavailable" : "You're now available!");
    } catch (error: any) {
      toast.error("Failed to update availability");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted");
    } catch (error: any) {
      toast.error("Failed to delete service");
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !packageForm.features.includes(featureInput.trim())) {
      setPackageForm({ ...packageForm, features: [...packageForm.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (feature: string) => {
    setPackageForm({ ...packageForm, features: packageForm.features.filter((f) => f !== feature) });
  };

  const handleCreatePackage = async () => {
    if (!packageForm.name || !packageForm.price) {
      toast.error("Name and price are required");
      return;
    }
    
    try {
      await createPackage.mutateAsync({
        freelancer_id: profile.id,
        name: packageForm.name,
        description: packageForm.description || null,
        price: parseFloat(packageForm.price),
        delivery_days: parseInt(packageForm.delivery_days),
        revisions: parseInt(packageForm.revisions),
        features: packageForm.features,
        is_popular: packageForm.is_popular,
      });
      toast.success("Package created!");
      setAddPackageOpen(false);
      setPackageForm({
        name: "",
        description: "",
        price: "",
        delivery_days: "7",
        revisions: "1",
        features: [],
        is_popular: false,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create package");
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await deletePackage.mutateAsync(id);
      toast.success("Package deleted");
    } catch (error: any) {
      toast.error("Failed to delete package");
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updateData: { status: string; completed_at?: string } = { status: newStatus };
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      }
      await updateOrder.mutateAsync({ id: orderId, ...updateData });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update order");
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "in_progress":
        return <Badge className="bg-primary text-primary-foreground"><RefreshCw className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingOrders = orders.filter(o => o.status === "pending");
  const activeOrders = orders.filter(o => o.status === "in_progress");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Freelancer Dashboard
              </h1>
              <p className="text-muted-foreground">Manage your profile, packages, and orders</p>
            </div>
            <div className="flex gap-3">
              {pendingOrders.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {pendingOrders.length} new order{pendingOrders.length > 1 ? "s" : ""}
                </Badge>
              )}
              <Button onClick={() => navigate("/freelance")} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Marketplace
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.rating?.toFixed(1) || "0.0"}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.total_jobs || 0}</p>
                  <p className="text-xs text-muted-foreground">Jobs Done</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{packages.length}</p>
                  <p className="text-xs text-muted-foreground">Packages</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeOrders.length}</p>
                  <p className="text-xs text-muted-foreground">Active Orders</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders" className="relative">
                Orders
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="packages">Packages ({packages.length})</TabsTrigger>
              <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Incoming Orders</h2>
                
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground">
                        Orders will appear here when clients purchase your packages
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getOrderStatusBadge(order.status)}
                                <span className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-semibold text-lg mb-1">
                                {order.package?.name || "Custom Order"}
                              </h3>
                              <p className="text-2xl font-bold text-primary mb-2">
                                ${order.total_amount}
                              </p>
                              {order.requirements && (
                                <div className="bg-secondary/50 rounded-lg p-3 mt-3">
                                  <p className="text-sm text-muted-foreground font-medium mb-1">Requirements:</p>
                                  <p className="text-sm">{order.requirements}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2">
                              {order.status === "pending" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleOrderStatusChange(order.id, "in_progress")}
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleOrderStatusChange(order.id, "cancelled")}
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              {order.status === "in_progress" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleOrderStatusChange(order.id, "completed")}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Packages</h2>
                  <Dialog open={addPackageOpen} onOpenChange={setAddPackageOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Package</DialogTitle>
                        <DialogDescription>
                          Add a new service package for clients to purchase
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Package Name</Label>
                          <Input
                            placeholder="e.g., Basic, Standard, Premium"
                            value={packageForm.name}
                            onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="What's included in this package?"
                            value={packageForm.description}
                            onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Price ($)</Label>
                            <Input
                              type="number"
                              value={packageForm.price}
                              onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Days</Label>
                            <Input
                              type="number"
                              value={packageForm.delivery_days}
                              onChange={(e) => setPackageForm({ ...packageForm, delivery_days: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Revisions</Label>
                            <Input
                              type="number"
                              value={packageForm.revisions}
                              onChange={(e) => setPackageForm({ ...packageForm, revisions: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Features</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a feature"
                              value={featureInput}
                              onChange={(e) => setFeatureInput(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                            />
                            <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          {packageForm.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {packageForm.features.map((feature) => (
                                <Badge key={feature} variant="secondary" className="pr-1">
                                  {feature}
                                  <button onClick={() => removeFeature(feature)} className="ml-1 hover:text-destructive">
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={packageForm.is_popular}
                            onCheckedChange={(checked) => setPackageForm({ ...packageForm, is_popular: checked })}
                          />
                          <Label>Mark as Most Popular</Label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setAddPackageOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleCreatePackage} disabled={createPackage.isPending}>
                          {createPackage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Package"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {packagesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : packages.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">No packages yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create packages with tiered pricing to attract more clients
                      </p>
                      <Button onClick={() => setAddPackageOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Package
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {packages.map((pkg) => (
                      <Card key={pkg.id} className={pkg.is_popular ? "border-primary" : ""}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {pkg.name}
                                {pkg.is_popular && <Badge>Popular</Badge>}
                              </CardTitle>
                              <p className="text-2xl font-bold text-primary mt-1">${pkg.price}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {pkg.description && (
                            <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm mb-3">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {pkg.delivery_days} days
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <RefreshCw className="w-4 h-4" />
                              {pkg.revisions} revisions
                            </div>
                          </div>
                          {pkg.features && pkg.features.length > 0 && (
                            <ul className="space-y-1">
                              {pkg.features.slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                  <Check className="w-3 h-3 text-primary" />
                                  {feature}
                                </li>
                              ))}
                              {pkg.features.length > 3 && (
                                <li className="text-sm text-muted-foreground">
                                  +{pkg.features.length - 3} more
                                </li>
                              )}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Services</h2>
                  <Button onClick={() => setAddServiceOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>

                {servicesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : services.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="font-semibold mb-2">No services yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first service to start receiving orders
                      </p>
                      <Button onClick={() => setAddServiceOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Service
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {services.map((service) => (
                      <Card key={service.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{service.title}</CardTitle>
                              {service.category && (
                                <Badge variant="outline" className="mt-1">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 font-semibold text-primary">
                              <DollarSign className="w-4 h-4" />
                              {service.price}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {service.delivery_days} days
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile.name}
                      {profile.is_verified && (
                        <Badge variant="default" className="text-xs">Verified</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{profile.title}</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Available</span>
                      <Switch
                        checked={profile.is_available || false}
                        onCheckedChange={toggleAvailability}
                      />
                    </div>
                    {!isEditing && (
                      <Button variant="outline" size="sm" onClick={startEditing}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={editForm.avatar_url} />
                          <AvatarFallback>{editForm.name.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={uploading}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading ? "Uploading..." : "Change Avatar"}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hourly Rate ($) - Optional</Label>
                          <Input
                            type="number"
                            value={editForm.hourly_rate}
                            onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                            placeholder="Leave empty for package pricing only"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Portfolio URL</Label>
                          <Input
                            type="url"
                            value={editForm.portfolio_url}
                            onChange={(e) => setEditForm({ ...editForm, portfolio_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {editForm.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="pr-1">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Thumbnail Upload */}
                      <div className="space-y-2">
                        <Label>Profile Thumbnail</Label>
                        <div className="flex items-center gap-4">
                          {editForm.thumbnail_url && (
                            <img
                              src={editForm.thumbnail_url}
                              alt="Thumbnail"
                              className="h-24 w-40 object-cover rounded-lg"
                            />
                          )}
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => thumbnailInputRef.current?.click()}
                            disabled={uploading}
                          >
                            <Image className="h-4 w-4 mr-2" />
                            {editForm.thumbnail_url ? "Change Thumbnail" : "Upload Thumbnail"}
                          </Button>
                        </div>
                      </div>

                      {/* Portfolio Images */}
                      <div className="space-y-2">
                        <Label>Portfolio Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {editForm.portfolio_images.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Portfolio ${index + 1}`}
                                className="h-32 w-full object-cover rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePortfolioImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <input
                            ref={portfolioInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePortfolioUpload}
                          />
                          <button
                            type="button"
                            className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                            onClick={() => portfolioInputRef.current?.click()}
                            disabled={uploading}
                          >
                            <Upload className="h-6 w-6" />
                            <span className="text-sm">Add Images</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button onClick={saveProfile} disabled={updateProfile.isPending}>
                          {updateProfile.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : null}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-primary">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-semibold">{profile.rating?.toFixed(1) || "0.0"}</span>
                          <span className="text-muted-foreground">({profile.total_jobs || 0} jobs)</span>
                        </div>
                        {profile.hourly_rate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            <span>${profile.hourly_rate}/hr</span>
                          </div>
                        )}
                      </div>

                      {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}

                      {profile.skills && profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {profile.portfolio_url && (
                        <a
                          href={profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddServiceDialog
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        freelancerId={profile.id}
      />

      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
