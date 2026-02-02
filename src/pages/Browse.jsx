import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreamCard from "@/components/StreamCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, LayoutGrid, Loader2, Radio } from "lucide-react";
import { useStreams } from "@/hooks/useStreams";
import { useCategories } from "@/hooks/useCategories";

const Browse = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData } = useCategories();
  const { data: streams, isLoading } = useStreams(
    activeCategory !== "All" ? activeCategory.toLowerCase() : undefined,
    true
  );

  const categories = ["All", ...(categoriesData?.map(c => c.name) || [])];

  const filteredStreams = streams?.filter(stream => 
    stream.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Browse Streams
            </h1>
            <p className="text-muted-foreground">
              Discover live streams from creators around the world
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search streams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "compact" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("compact")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStreams.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filteredStreams.length} stream{filteredStreams.length !== 1 ? 's' : ''} live
              </p>

              {/* Stream Grid */}
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              }`}>
                {filteredStreams.map((stream, index) => (
                  <div
                    key={stream.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <StreamCard
                      id={stream.id}
                      title={stream.title}
                      streamer={stream.user_id}
                      category={stream.categories?.name || "Uncategorized"}
                      thumbnail={stream.thumbnail_url || ""}
                      avatar=""
                      viewers={stream.viewer_count || 0}
                      isLive={stream.is_live || false}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Radio className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Live Streams</h3>
              <p className="text-muted-foreground mb-6">
                {activeCategory !== "All" 
                  ? `No one is streaming in ${activeCategory} right now`
                  : "No one is streaming right now"
                }
              </p>
              <p className="text-sm text-muted-foreground">
                Check back later or explore other categories
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
