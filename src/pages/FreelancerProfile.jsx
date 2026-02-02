import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFreelancerById } from "@/hooks/useFreelancerProfile";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ContactFreelancerDialog from "@/components/ContactFreelancerDialog";

const FreelancerProfile = () => {
  const { id } = useParams();
  const { data: freelancer, isLoading } = useFreelancerById(id);
  const { packages } = useFreelancerPackages(id);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {freelancer.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span>{freelancer.rating}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{freelancer.total_jobs || 0} jobs completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            </div>

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
