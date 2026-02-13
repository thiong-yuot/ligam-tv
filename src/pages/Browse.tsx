import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreamCard from "@/components/StreamCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Radio, Users } from "lucide-react";
import { useStreams } from "@/hooks/useStreams";
import { useCategories } from "@/hooks/useCategories";

const Browse = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData = [] } = useCategories();
  const { data: streams, isLoading } = useStreams(
    activeCategory !== "All" ? activeCategory.toLowerCase() : undefined
  );

  const filteredStreams = streams?.filter(stream => 
    stream.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatViewers = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="text-lg font-display font-bold text-foreground">Browse</h1>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-card border-border"
              />
            </div>
          </div>

          {/* Categories */}
          {categoriesData.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
              <button
                onClick={() => setActiveCategory("All")}
                className={`rounded-lg border p-2 text-xs font-medium transition-colors ${activeCategory === "All" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30"}`}
              >
                All
              </button>
              {categoriesData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`group rounded-lg border overflow-hidden transition-colors ${activeCategory === category.name ? "border-primary" : "border-border hover:border-muted-foreground/30"}`}
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
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStreams.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredStreams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  id={stream.id}
                  title={stream.title}
                  streamer={stream.user_id}
                  category={stream.categories?.name || "Uncategorized"}
                  thumbnail={stream.thumbnail_url || ""}
                  avatar=""
                  viewers={stream.viewer_count || 0}
                  isLive={stream.is_live || false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-foreground mb-1">No Live Streams</h3>
              <p className="text-xs text-muted-foreground">Check back later</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
