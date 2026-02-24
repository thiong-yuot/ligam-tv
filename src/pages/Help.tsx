import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  HelpCircle, 
  Search,
  Video,
  DollarSign,
  Shield,
  Settings,
  Users,
  MessageSquare,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import { useHelpCategories, usePopularArticles } from "@/hooks/useHelp";

const iconMap: Record<string, LucideIcon> = {
  Video, DollarSign, Shield, Settings, Users, MessageSquare, HelpCircle,
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories, isLoading: categoriesLoading } = useHelpCategories();
  const { data: popularArticles, isLoading: articlesLoading } = usePopularArticles();

  const filteredCategories = useMemo(() => {
    if (!categories || !searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      cat => cat.name.toLowerCase().includes(query) || cat.description?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!popularArticles || !searchQuery) return popularArticles;
    const query = searchQuery.toLowerCase();
    return popularArticles.filter(
      article => article.title.toLowerCase().includes(query) || article.summary?.toLowerCase().includes(query)
    );
  }, [popularArticles, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-lg font-display font-bold text-foreground mb-3">Help Center</h1>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-card border-border"
              />
            </div>
          </div>

          {/* Categories */}
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h2>
            <div className="grid grid-cols-2 gap-2">
              {categoriesLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg bg-card border border-border">
                    <Skeleton className="w-7 h-7 rounded-lg mb-2" />
                    <Skeleton className="h-3.5 w-20 mb-1" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))
              ) : filteredCategories?.length === 0 ? (
                <p className="text-xs text-muted-foreground col-span-full text-center py-6">
                  No categories found
                </p>
              ) : (
                filteredCategories?.map((category) => {
                  const IconComponent = iconMap[category.icon] || HelpCircle;
                  return (
                    <Link key={category.id} to={`/help/${category.slug}`}>
                      <div className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">{category.name}</p>
                        <p className="text-[10px] text-muted-foreground">{category.article_count} articles</p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </section>

          {/* Popular Articles */}
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular Articles</h2>
            <div className="space-y-1">
              {articlesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3.5 w-3.5" />
                  </div>
                ))
              ) : filteredArticles?.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No articles found</p>
              ) : (
                filteredArticles?.map((article) => (
                  <Link 
                    key={article.id}
                    to={`/help/article/${article.id}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <span className="text-xs text-foreground group-hover:text-primary transition-colors">{article.title}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Contact link */}
          <div className="text-center py-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Can't find what you need?</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/contact" className="text-xs text-primary hover:underline font-medium">Contact Support</Link>
              <span className="text-border">·</span>
              <Link to="/faq" className="text-xs text-primary hover:underline font-medium">View FAQ</Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
