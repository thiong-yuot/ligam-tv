import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFreelancerById, useFreelancerServices } from "@/hooks/useFreelancerProfile";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { useFreelancerReviews } from "@/hooks/useFreelancerReviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, CheckCircle, MessageCircle, Image, Briefcase, MessageSquare, CircleCheck, CircleX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ContactFreelancerDialog from "@/components/ContactFreelancerDialog";

const FreelancerProfile = () => {
  const { id } = useParams();
  const { data: freelancer, isLoading } = useFreelancerById(id);
  const { packages } = useFreelancerPackages(id);
  const { data: services = [] } = useFreelancerServices(id);
  const { data: reviews = [] } = useFreelancerReviews(id);
  const [selectedImage, setSelectedImage] = useState(null);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Freelancer not found
            </h1>
            <p className="text-muted-foreground">
              The freelancer profile you're looking for doesn't exist.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const portfolioImages = freelancer.portfolio_images || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {freelancer.name?.charAt(0) || "F"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-foreground">
                          {freelancer.name}
                        </h1>
                        {freelancer.is_verified && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground mb-2">
                        {freelancer.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {(averageRating || freelancer.rating) && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span>{averageRating || freelancer.rating}</span>
                            {reviews.length > 0 && (
                              <span className="text-muted-foreground">({reviews.length} reviews)</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{freelancer.total_jobs || 0} jobs completed</span>
                        </div>
                        {/* Availability Status */}
                        <div className="flex items-center gap-1">
                          {freelancer.is_available ? (
                            <>
                              <CircleCheck className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 font-medium">Available</span>
                            </>
                          ) : (
                            <>
                              <CircleX className="h-4 w-4 text-red-500" />
                              <span className="text-red-600 font-medium">Unavailable</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for different sections */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="services" className="gap-1">
                    <Briefcase className="h-4 w-4 hidden sm:inline" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="gap-1">
                    <Image className="h-4 w-4 hidden sm:inline" />
                    Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="gap-1">
                    <MessageSquare className="h-4 w-4 hidden sm:inline" />
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {freelancer.bio || "No bio provided."}
                      </p>
                    </CardContent>
                  </Card>

                  {freelancer.skills && freelancer.skills.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services">
                  <Card>
                    <CardHeader>
                      <CardTitle>Services Offered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {services.length > 0 ? (
                        <div className="space-y-4">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              className="p-4 border border-border rounded-lg space-y-2"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-foreground">{service.title}</h3>
                                  {service.category && (
                                    <Badge variant="outline" className="mt-1">
                                      {service.category}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xl font-bold text-primary">
                                  ${service.price}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {service.description}
                              </p>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{service.delivery_days} days delivery</span>
                                <ContactFreelancerDialog
                                  freelancer={freelancer}
                                  trigger={
                                    <Button size="sm">Order Service</Button>
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No services available yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {portfolioImages.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {portfolioImages.map((imageUrl, index) => (
                              <div
                                key={index}
                                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-border"
                                onClick={() => setSelectedImage(imageUrl)}
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Portfolio ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          
                          {/* Image Modal */}
                          {selectedImage && (
                            <div
                              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                              onClick={() => setSelectedImage(null)}
                            >
                              <img
                                src={selectedImage}
                                alt="Portfolio preview"
                                className="max-w-full max-h-full object-contain rounded-lg"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            No portfolio images yet.
                          </p>
                        </div>
                      )}

                      {freelancer.portfolio_url && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <a
                            href={freelancer.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View external portfolio →
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Reviews</CardTitle>
                        {averageRating && (
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold">{averageRating}</span>
                            <span className="text-muted-foreground">({reviews.length} reviews)</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div
                              key={review.id}
                              className="p-4 border border-border rounded-lg space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {review.review_text && (
                                <p className="text-muted-foreground">
                                  {review.review_text}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            No reviews yet.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Packages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {packages && packages.length > 0 ? (
                    packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-4 border border-border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{pkg.name}</h3>
                          {pkg.is_popular && (
                            <Badge variant="default">Popular</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">
                            ${pkg.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {pkg.delivery_days} days delivery
                          </span>
                        </div>
                        <ContactFreelancerDialog
                          freelancer={freelancer}
                          packageId={pkg.id}
                          trigger={
                            <Button className="w-full">Order Now</Button>
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No packages available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <ContactFreelancerDialog
                    freelancer={freelancer}
                    trigger={
                      <Button variant="outline" className="w-full gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Contact Me
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerProfile;
