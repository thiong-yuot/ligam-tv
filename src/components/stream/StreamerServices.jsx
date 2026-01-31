import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Briefcase, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight,
  Star,
  ShoppingCart,
  Loader2
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCourses } from "@/hooks/useCourses";
import { useFreelancers } from "@/hooks/useFreelancers";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { useCart } from "@/hooks/useCart";
import { useFreelancerCheckout, useCourseCheckout } from "@/hooks/useStripeCheckout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import FreelancerOrderDialog from "./FreelancerOrderDialog";

const StreamerServices = ({ streamerId, streamerUsername }) => {
  const { data: allProducts = [] } = useProducts();
  const { data: allCourses = [] } = useCourses();
  const { data: allFreelancers = [] } = useFreelancers();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkout: freelancerCheckout, loading: freelancerLoading } = useFreelancerCheckout();
  const { checkout: courseCheckout, loading: courseLoading } = useCourseCheckout();
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [loadingCourseId, setLoadingCourseId] = useState(null);

  // Filter by streamer
  const products = allProducts.filter(p => p.seller_id === streamerId).slice(0, 4);
  const courses = allCourses.filter(c => c.creator_id === streamerId).slice(0, 4);
  const freelancer = allFreelancers.find(f => f.user_id === streamerId);
  
  const { data: packages = [] } = useFreelancerPackages(freelancer?.id);
  const displayPackages = packages.slice(0, 3);

  const hasProducts = products.length > 0;
  const hasCourses = courses.length > 0;
  const hasServices = freelancer && displayPackages.length > 0;

  // Don't render if streamer has no services
  if (!hasProducts && !hasCourses && !hasServices) {
    return null;
  }

  // Determine default tab
  const defaultTab = hasProducts ? "products" : hasCourses ? "courses" : "services";

  const handleAddToCart = (product) => {
    setLoadingProductId(product.id);
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    setTimeout(() => setLoadingProductId(null), 500);
  };

  const handleCourseEnroll = async (course) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to enroll in courses.",
        variant: "destructive",
      });
      return;
    }
    
    if (course.price === 0) {
      toast({
        title: "Free course",
        description: "This course is free! Visit the course page to start learning.",
      });
      return;
    }
    
    setLoadingCourseId(course.id);
    await courseCheckout(course.id);
    setLoadingCourseId(null);
  };

  const handlePackageOrder = (pkg) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to order services.",
        variant: "destructive",
      });
      return;
    }
    setSelectedPackage(pkg);
    setOrderDialogOpen(true);
  };

  const handleOrderSubmit = async (requirements) => {
    if (selectedPackage) {
      await freelancerCheckout(selectedPackage.id, requirements);
      setOrderDialogOpen(false);
      setSelectedPackage(null);
    }
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Creator's Shop & Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              {hasProducts && (
                <TabsTrigger value="products" className="gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Store</span>
                </TabsTrigger>
              )}
              {hasCourses && (
                <TabsTrigger value="courses" className="gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Courses</span>
                </TabsTrigger>
              )}
              {hasServices && (
                <TabsTrigger value="services" className="gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Services</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Products Tab */}
            {hasProducts && (
              <TabsContent value="products" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {products.map((product) => (
                    <div key={product.id} className="group">
                      <Link to={`/shop`} className="block">
                        <div className="aspect-square rounded-lg bg-secondary overflow-hidden mb-2">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          {product.sale_price ? (
                            <>
                              <span className="text-sm font-bold text-primary">
                                ${product.sale_price.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-primary">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="h-7 px-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={loadingProductId === product.id}
                        >
                          {loadingProductId === product.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/shop">
                  <Button variant="ghost" size="sm" className="w-full mt-4 group">
                    View Store
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </TabsContent>
            )}

            {/* Courses Tab */}
            {hasCourses && (
              <TabsContent value="courses" className="mt-0">
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="group flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Link to={`/courses/${course.id}`} className="flex gap-3 flex-1 min-w-0">
                        <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-primary/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {course.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{course.total_enrollments || 0} enrolled</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </span>
                        <Button 
                          size="sm" 
                          variant="default"
                          className="h-7 text-xs"
                          onClick={() => handleCourseEnroll(course)}
                          disabled={loadingCourseId === course.id || courseLoading}
                        >
                          {loadingCourseId === course.id ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : null}
                          {course.price === 0 ? "View" : "Enroll"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/courses">
                  <Button variant="ghost" size="sm" className="w-full mt-4 group">
                    View All Courses
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </TabsContent>
            )}

            {/* Services Tab */}
            {hasServices && (
              <TabsContent value="services" className="mt-0">
                {/* Freelancer Info */}
                <div className="mb-4 p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    {freelancer.avatar_url && (
                      <img 
                        src={freelancer.avatar_url} 
                        alt={freelancer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{freelancer.name}</p>
                      <p className="text-xs text-muted-foreground">{freelancer.title}</p>
                    </div>
                    {freelancer.is_verified && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {displayPackages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {pkg.delivery_days} day{pkg.delivery_days > 1 ? 's' : ''} delivery
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <Badge variant="default" className="font-bold">
                            ${pkg.price}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="h-7 text-xs"
                            onClick={() => handlePackageOrder(pkg)}
                            disabled={freelancerLoading}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={`/freelance/${freelancer.id}`}>
                  <Button variant="ghost" size="sm" className="w-full mt-4 group">
                    View All Services
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Freelancer Order Dialog */}
      <FreelancerOrderDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        package_={selectedPackage}
        freelancer={freelancer}
        onSubmit={handleOrderSubmit}
        loading={freelancerLoading}
      />
    </>
  );
};

export default StreamerServices;
