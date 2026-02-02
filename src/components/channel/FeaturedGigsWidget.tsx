import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, ExternalLink } from "lucide-react";

interface ServicePackage {
  id: string;
  name: string;
  price: number;
  delivery_days: number;
}

interface Freelancer {
  id: string;
  name: string;
  title: string;
  rating?: number | null;
}

interface FeaturedServicesWidgetProps {
  freelancer: Freelancer | null;
  packages: ServicePackage[];
  maxItems?: number;
}

const FeaturedServicesWidget = ({ 
  freelancer, 
  packages,
  maxItems = 3 
}: FeaturedServicesWidgetProps) => {
  const displayPackages = packages.slice(0, maxItems);

  if (!freelancer || displayPackages.length === 0) return null;

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Available Services</h3>
        </div>
        <Link to={`/freelancers/${freelancer.id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            View All
            <ExternalLink className="w-3 h-3" />
          </Button>
        </Link>
      </div>
      
      {/* Freelancer Info */}
      <div className="mb-4 p-2 rounded-lg bg-secondary/30">
        <p className="text-sm font-medium text-foreground">{freelancer.name}</p>
        <p className="text-xs text-muted-foreground">{freelancer.title}</p>
        {freelancer.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Briefcase className="w-3 h-3 text-primary" />
            <span className="text-xs text-foreground">Verified Pro</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {displayPackages.map((pkg) => (
          <Link 
            key={pkg.id} 
            to={`/freelancers/${freelancer.id}`}
            className="block p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {pkg.delivery_days} day{pkg.delivery_days > 1 ? 's' : ''} delivery
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="font-bold">
                ${pkg.price}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default FeaturedServicesWidget;