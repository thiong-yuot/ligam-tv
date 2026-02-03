import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Star,
  DollarSign,
  Clock,
  Briefcase,
  ExternalLink,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Package,
  Check,
  Sparkles,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useFreelancerById, useFreelancerServices } from "@/hooks/useFreelancerProfile";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { useFreelancerCheckout } from "@/hooks/useStripeCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ContactFreelancerDialog from "@/components/ContactFreelancerDialog";

const FreelancerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [requirements, setRequirements] = useState("");
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  
  const { data: freelancer, isLoading: freelancerLoading } = useFreelancerById(id || "");
  const { data: services = [], isLoading: servicesLoading } = useFreelancerServices(id || "");
  const { data: packages = [], isLoading: packagesLoading } = useFreelancerPackages(id || "");
  const { checkout, loading: checkoutLoading } = useFreelancerCheckout();

  const handleOrderPackage = async (packageId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to order services",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    await checkout(packageId, requirements);
    setOrderDialogOpen(false);
    setRequirements("");
  };

  if (freelancerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Freelancer not found</h1>
          <Button onClick={() => navigate("/freelance")}>Back to Marketplace</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedPkg = packages.find(p => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/freelance")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative">
                      <img
                        src={freelancer.avatar_url || "/placeholder.svg"}
                        alt={freelancer.name}
                        className="w-32 h-32 rounded-2xl object-cover"
                      />
                      {freelancer.is_available && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full border-4 border-card flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                            {freelancer.name}
                            {freelancer.is_verified && (
                              <Badge variant="default">Verified</Badge>
                            )}
                          </h1>
                          <p className="text-xl text-muted-foreground">{freelancer.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="font-semibold text-lg">
                            {freelancer.rating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="text-muted-foreground">
                            ({freelancer.total_jobs || 0} jobs)
                          </span>
                        </div>
                        {freelancer.hourly_rate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-5 h-5" />
                            <span className="font-semibold">${freelancer.hourly_rate}/hr</span>
                          </div>
                        )}
                      </div>

                      {freelancer.bio && (
                        <p className="text-muted-foreground mb-4">{freelancer.bio}</p>
                      )}

                      {freelancer.skills && freelancer.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {freelancer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3">
                        {freelancer.portfolio_url && (
                          <a
                            href={freelancer.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Portfolio
                            </Button>
                          </a>
                        )}
                        {freelancer.user_id && (
                          <ContactFreelancerDialog
                            freelancerId={freelancer.id}
                            freelancerUserId={freelancer.user_id}
                            freelancerName={freelancer.name}
                          >
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </ContactFreelancerDialog>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Services and Reviews */}
              <Tabs defaultValue="services">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="mt-6">
                  {servicesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : services.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No individual services listed</p>
                        <p className="text-sm text-muted-foreground mt-1">Check out the packages on the right!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {services.map((service) => (
                        <Card key={service.id} className="hover:border-primary/50 transition-colors">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            {service.category && (
                              <Badge variant="outline" className="w-fit">{service.category}</Badge>
                            )}
                          </CardHeader>
                          <CardContent>
                            {service.description && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {service.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 font-bold text-xl text-primary">
                                <DollarSign className="w-5 h-5" />
                                {service.price}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {service.delivery_days} days
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardContent className="text-center py-12">
                      <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Packages - Right Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Service Packages
              </h2>

              {packagesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : packages.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No packages available</p>
                    {freelancer.user_id && (
                      <ContactFreelancerDialog
                        freelancerId={freelancer.id}
                        freelancerUserId={freelancer.user_id}
                        freelancerName={freelancer.name}
                      >
                        <Button variant="outline" className="mt-4" size="sm">
                          Request Custom Quote
                        </Button>
                      </ContactFreelancerDialog>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg, index) => {
                    const icons = [Zap, Sparkles, Briefcase];
                    const Icon = icons[index % icons.length];
                    
                    return (
                      <Card 
                        key={pkg.id} 
                        className={`relative transition-all hover:border-primary/50 ${
                          pkg.is_popular ? "border-primary ring-1 ring-primary/20" : ""
                        }`}
                      >
                        {pkg.is_popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            Most Popular
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">{pkg.name}</CardTitle>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {pkg.description && (
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm">
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
                            <ul className="space-y-2">
                              {pkg.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                  <span className="text-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <Dialog open={orderDialogOpen && selectedPackage === pkg.id} onOpenChange={(open) => {
                            setOrderDialogOpen(open);
                            if (open) setSelectedPackage(pkg.id);
                          }}>
                            <DialogTrigger asChild>
                              <Button className="w-full" onClick={() => setSelectedPackage(pkg.id)}>
                                Order Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Order: {selectedPkg?.name}</DialogTitle>
                                <DialogDescription>
                                  ${selectedPkg?.price} • {selectedPkg?.delivery_days} day delivery
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="requirements">Project Requirements</Label>
                                  <Textarea
                                    id="requirements"
                                    placeholder="Describe what you need..."
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    rows={4}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setOrderDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  className="flex-1" 
                                  onClick={() => handleOrderPackage(pkg.id)}
                                  disabled={checkoutLoading}
                                >
                                  {checkoutLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    `Pay with Stripe • $${pkg.price}`
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FreelancerProfile;
