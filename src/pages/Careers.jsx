import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight,
  Heart,
  Zap,
  Globe,
  Users,
  Loader2
} from "lucide-react";
import { useJobs } from "@/hooks/useJobs";

const Careers = () => {
  const { data: jobs = [], isLoading } = useJobs();

  const benefits = [
    { icon: Globe, title: "Remote First", description: "Work from anywhere in the world" },
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive health coverage" },
    { icon: Zap, title: "Equity", description: "Own a piece of what you build" },
    { icon: Users, title: "Team Events", description: "Regular team retreats and meetups" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            Careers
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            Join Our <span className="text-primary">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us build the future of live streaming. We're looking for passionate 
            people who want to make a difference.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-12">
            Why Work With Us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8">
            Open Positions
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="default" className="gap-2 flex-shrink-0">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No open positions right now
              </h3>
              <p className="text-muted-foreground">
                Check back soon or send us a general application below
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-card/30 border-t border-border">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind.
          </p>
          <a href="mailto:careers@ligam.tv?subject=General Application">
            <Button variant="outline" size="lg">
              Send General Application
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
