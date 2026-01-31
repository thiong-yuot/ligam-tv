import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  ArrowRight
} from "lucide-react";
import { useHelpCategories, usePopularArticles } from "@/hooks/useHelp";

const iconMap = {
  Video,
  DollarSign,
  Shield,
  Settings,
  Users,
  MessageSquare,
  HelpCircle,
};

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories, isLoading: categoriesLoading } = useHelpCategories();
  const { data: popularArticles, isLoading: articlesLoading } = usePopularArticles();

  const filteredCategories = useMemo(() => {
    if (!categories || !searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(
      cat => cat.name.toLowerCase().includes(query) || 
             cat.description?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const filteredArticles = useMemo(() => {
    if (!popularArticles || !searchQuery) return popularArticles;
    const query = searchQuery.toLowerCase();
    return popularArticles.filter(
      article => article.title.toLowerCase().includes(query) ||
                 article.summary?.toLowerCase().includes(query)
    );
  }, [popularArticles, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-6">
            How Can We <span className="text-primary">Help</span>?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Search our knowledge base or browse categories below
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">
            Browse by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="p-6 bg-card border-border">
                  <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-20" />
                </Card>
              ))
            ) : filteredCategories?.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No categories found matching "{searchQuery}"
              </p>
            ) : (
              filteredCategories?.map((category) => {
                const IconComponent = iconMap[category.icon] || HelpCircle;
                return (
                  <Link key={category.id} to={`/help/${category.slug}`}>
                    <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group h-full">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <span className="text-sm text-primary">{category.article_count} articles</span>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="container mx-auto">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">
            Popular Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {articlesLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-5" />
                </div>
              ))
            ) : filteredArticles?.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No articles found matching "{searchQuery}"
              </p>
            ) : (
              filteredArticles?.map((article) => (
                <Link 
                  key={article.id}
                  to={`/help/article/${article.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-6">
            Still Need Help?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="default" size="lg" className="gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="outline" size="lg">
                View FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Help;
