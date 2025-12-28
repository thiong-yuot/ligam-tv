import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import StreamCard from "@/components/StreamCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, Sparkles, Zap, Users } from "lucide-react";
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
        {/* Category Pills - Sticky */}
        <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl border-b border-border/30 py-3 px-4 lg:px-6">
          <CategoryFilter 
            categories={categoryNames}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-6 space-y-10">
          {/* Featured Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-background to-emerald-500/10 p-6 lg:p-8 border border-primary/20">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Live Now</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
                Discover Amazing Streams
              </h1>
              <p className="text-muted-foreground mb-4 max-w-md">
                Watch live content from creators around the world. Gaming, music, art, and more.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/browse">
                  <Button className="rounded-xl shadow-lg shadow-primary/20">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Explore Now
                  </Button>
                </Link>
                <Link to="/go-live">
                  <Button variant="outline" className="rounded-xl">
                    Start Streaming
                  </Button>
                </Link>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
          </section>

          {/* Live Streams */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-foreground">
                  {activeCategory === "All" ? "Live Now" : activeCategory}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredStreams.length} streaming
                </span>
              </div>
              <Link to="/browse" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                See all
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
                    className="animate-fade-in"
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
              <div className="text-center py-16 bg-secondary/30 rounded-2xl border border-border/50">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No streams right now
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Be the first to go live and start your community!
                </p>
                <Link to="/go-live">
                  <Button className="rounded-xl">
                    Start Streaming
                  </Button>
                </Link>
              </div>
            )}
          </section>

          {/* Categories */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Browse Categories
              </h2>
              <Link to="/categories" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                View all
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
                    <div className="aspect-[4/5] rounded-xl bg-secondary/50 border border-border/50 overflow-hidden relative mb-2 group-hover:border-primary/50 transition-all group-hover:shadow-lg group-hover:shadow-primary/10">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-emerald-500/20 flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/30">{category.name[0]}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.viewer_count || 0} watching
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No categories available yet
              </div>
            )}
          </section>

          {/* Popular Section */}
          {streams.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Trending
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {streams.slice(0, 5).map((stream, index) => (
                  <div
                    key={`trending-${stream.id}`}
                    className="animate-fade-in"
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
            </section>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
