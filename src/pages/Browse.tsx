import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreamCard from "@/components/StreamCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Radio } from "lucide-react";
import { useStreams } from "@/hooks/useStreams";
import { useCategories } from "@/hooks/useCategories";

const Browse = () => {
  const [activeCategory, setActiveCategory] = useState("All");
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
      
      <main className="pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Browse</h1>
            <p className="text-sm text-muted-foreground mt-1">Discover live streams</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search streams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          <div className="mb-6">
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStreams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No Live Streams</h3>
              <p className="text-sm text-muted-foreground">Check back later</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
