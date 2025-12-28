import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useFreelancerById, useFreelancerServices } from "@/hooks/useFreelancerProfile";
import { toast } from "sonner";

const FreelancerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: freelancer, isLoading: freelancerLoading } = useFreelancerById(id || "");
  const { data: services = [], isLoading: servicesLoading } = useFreelancerServices(id || "");

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

  const handleContact = () => {
    toast.info("Contact feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/freelance")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>

          {/* Profile Header */}
          <Card className="mb-8">
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
                    <Button onClick={handleContact} size="lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold text-lg">
                        {freelancer.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-muted-foreground">
                        ({freelancer.total_jobs || 0} jobs completed)
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

                  {freelancer.portfolio_url && (
                    <a
                      href={freelancer.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Portfolio
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Services
            </h2>

            {servicesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : services.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No services available yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleContact}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      {service.category && (
                        <Badge variant="outline" className="w-fit">
                          {service.category}
                        </Badge>
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
                      <Button className="w-full mt-4">Order Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FreelancerProfile;
