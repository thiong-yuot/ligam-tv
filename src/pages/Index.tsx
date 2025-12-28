import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StreamCard from "@/components/StreamCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { useStreams } from "@/hooks/useStreams";
import { useCategories } from "@/hooks/useCategories";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: streams = [], isLoading: streamsLoading } = useStreams(undefined, true);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const categoryNames = ["All", ...categories.map(c => c.name)];

  const filteredStreams = activeCategory === "All" 
    ? streams 
    : streams.filter(s => s.categories?.name === activeCategory);

  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen">
        {/* Category Filter - Fixed at top like YouTube */}
        <div className="sticky top-14 z-40 bg-background border-b border-border py-3 px-4 lg:px-6">
          <CategoryFilter 
            categories={categoryNames}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-6">
          {/* Live Streams Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {activeCategory === "All" ? "Recommended Live" : `${activeCategory}`}
              </h2>
              <Link to="/browse" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                View all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {streamsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredStreams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredStreams.map((stream, index) => (
                  <div
                    key={stream.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <StreamCard 
                      id={stream.id}
                      title={stream.title}
                      streamer={stream.profiles?.display_name || stream.profiles?.username || "Unknown"}
                      category={stream.categories?.name || "Uncategorized"}
                      thumbnail={stream.thumbnail_url || "/placeholder.svg"}
                      avatar={stream.profiles?.avatar_url || "/placeholder.svg"}
                      viewers={stream.viewer_count || 0}
                      isLive={stream.is_live || false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No live streams right now
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Be the first to go live!
                </p>
                <Link to="/go-live">
                  <Button variant="default" size="sm">
                    Start Streaming
                  </Button>
                </Link>
              </div>
            )}
          </section>

          {/* Trending Categories */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Trending Categories
              </h2>
              <Link to="/categories" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                Browse all
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categories.slice(0, 12).map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/browse?category=${encodeURIComponent(category.name)}`}
                    className="group"
                  >
                    <div className="aspect-video rounded-lg bg-card border border-border overflow-hidden relative mb-2 group-hover:ring-2 ring-primary transition-all">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary/50">{category.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.viewer_count || 0} viewers
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No categories available yet
              </div>
            )}
          </section>

          {/* Continue Watching / Popular */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Popular streams
              </h2>
            </div>
            
            {streams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {streams.slice(0, 10).map((stream, index) => (
                  <div
                    key={`popular-${stream.id}`}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <StreamCard 
                      id={stream.id}
                      title={stream.title}
                      streamer={stream.profiles?.display_name || stream.profiles?.username || "Unknown"}
                      category={stream.categories?.name || "Uncategorized"}
                      thumbnail={stream.thumbnail_url || "/placeholder.svg"}
                      avatar={stream.profiles?.avatar_url || "/placeholder.svg"}
                      viewers={stream.viewer_count || 0}
                      isLive={stream.is_live || false}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
