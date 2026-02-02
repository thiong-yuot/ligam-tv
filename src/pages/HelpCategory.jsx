import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Video,
  DollarSign,
  Shield,
  Settings,
  Users,
  MessageSquare
} from "lucide-react";
import { useHelpArticles, useHelpCategories } from "@/hooks/useHelp";

const iconMap = {
  Video,
  DollarSign,
  Shield,
  Settings,
  Users,
  MessageSquare,
  HelpCircle,
};

const HelpCategory = () => {
  const { slug } = useParams();
  const { data: categories } = useHelpCategories();
  const { data: articles, isLoading } = useHelpArticles(slug);

  const category = categories?.find(c => c.slug === slug);
  const IconComponent = category ? (iconMap[category.icon] || HelpCircle) : HelpCircle;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/help" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Help Center
          </Link>

          {category && (
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {category.name}
                </h1>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="p-6 bg-card border-border">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </Card>
              ))
            ) : articles?.length === 0 ? (
              <Card className="p-8 bg-card border-border text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles found in this category yet.</p>
              </Card>
            ) : (
              articles?.map((article) => (
                <Link key={article.id} to={`/help/article/${article.id}`}>
                  <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {article.title}
                        </h3>
                        {article.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {article.summary}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>

          <div className="mt-12 text-center p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl font-display font-bold text-foreground mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help
            </p>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCategory;
