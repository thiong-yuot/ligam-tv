import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";

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

  if (isLoading) {
    return (
      <section className="py-6 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-foreground">Categories</h2>
          <Link to="/categories">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {categories.slice(0, 12).map((category) => (
            <Link
              key={category.id}
              to={`/browse?category=${encodeURIComponent(category.name)}`}
              className="group rounded-lg bg-card border border-border hover:border-primary/50 transition-colors overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                {category.image_url ? (
                  <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-background/60" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="font-medium text-foreground text-xs truncate">{category.name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    {formatViewers(category.viewer_count || 0)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCategories;
