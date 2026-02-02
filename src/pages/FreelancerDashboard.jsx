import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useMyFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { useFreelancerPackages } from "@/hooks/useFreelancerPackages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Package, Settings, Plus, DollarSign, Clock, Star } from "lucide-react";
import { FreelancerProfileForm } from "@/components/freelance/FreelancerProfileForm";
import PackageForm from "@/components/freelance/PackageForm";

const FreelancerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useMyFreelancerProfile();
  const { packages, isLoading: packagesLoading } = useFreelancerPackages();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Freelancer Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your freelance profile and packages
              </p>
            </div>
            {profile && (
              <Link to={`/freelance/${profile.id}`}>
                <Button variant="outline">View Public Profile</Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Orders
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.rating || "N/A"}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <Settings className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="packages" className="gap-2">
                <Package className="h-4 w-4" />
                Packages
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <FreelancerProfileForm existingProfile={profile} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="packages">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Packages</h2>
                </div>
                
                {packagesLoading ? (
                  <div className="text-muted-foreground">Loading packages...</div>
                ) : packages && packages.length > 0 ? (
                  <div className="grid gap-4">
                    {packages.map((pkg) => (
                      <Card key={pkg.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{pkg.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {pkg.description}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">${pkg.price}</Badge>
                                <Badge variant="outline">{pkg.delivery_days} days</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No packages yet. Create your first package to start selling.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Package</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PackageForm />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardContent className="py-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
