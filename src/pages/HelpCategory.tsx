import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  MessageSquare,
  LucideIcon
} from "lucide-react";
import { useHelpArticles, useHelpCategories } from "@/hooks/useHelp";

const iconMap: Record<string, LucideIcon> = {
  Video, DollarSign, Shield, Settings, Users, MessageSquare, HelpCircle,
};

const HelpCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useHelpCategories();
  const { data: articles, isLoading } = useHelpArticles(slug);

  const category = categories?.find(c => c.slug === slug);
  const IconComponent = category ? (iconMap[category.icon] || HelpCircle) : HelpCircle;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          <Link to="/help" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" />
            Help Center
          </Link>

          {category && (
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground">{category.name}</h1>
                {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
              </div>
            </div>
          )}

          <div className="space-y-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3.5 w-3.5" />
                </div>
              ))
            ) : articles?.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No articles in this category yet.</p>
              </div>
            ) : (
              articles?.map((article) => (
                <Link key={article.id} to={`/help/article/${article.id}`} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div>
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{article.title}</p>
                    {article.summary && <p className="text-[10px] text-muted-foreground line-clamp-1">{article.summary}</p>}
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Can't find what you need?</p>
            <Link to="/contact" className="text-xs text-primary hover:underline font-medium">Contact Support</Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCategory;
