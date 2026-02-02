import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, TrendingUp, Users } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  viewer_count: number | null;
  image_url: string | null;
  tags: string[] | null;
}

interface TrendingCategoriesProps {
  categories: Category[];
  isLoading: boolean;
}

const TrendingCategories = ({ categories, isLoading }: TrendingCategoriesProps) => {
  const formatViewers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Trending Categories
            </h2>
          </div>
          <Link to="/categories">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category, index) => (
              <Link
                key={category.id}
                to={`/browse?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Image or Gradient */}
                <div className="aspect-[4/3] relative">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-background/60" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatViewers(category.viewer_count || 0)} viewers
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-xl border border-border">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No categories available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingCategories;
