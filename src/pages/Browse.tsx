import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreamCard from "@/components/StreamCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Radio, Users, ArrowLeft } from "lucide-react";
import { useStreams } from "@/hooks/useStreams";
import { useCategories } from "@/hooks/useCategories";

const Browse = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();
  const { data: streams, isLoading: streamsLoading } = useStreams(
    selectedCategory?.toLowerCase() || undefined
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

          {!selectedCategory ? (
            <>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h1 className="text-lg font-display font-bold text-foreground">Browse</h1>
              </div>

              {categoriesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : categoriesData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {categoriesData.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className="group rounded-lg border border-border bg-card overflow-hidden hover:border-muted-foreground/30 transition-colors text-left"
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
              ) : (
                <div className="text-center py-20">
                  <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No categories yet</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCategory(null)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-lg font-display font-bold text-foreground">{selectedCategory}</h1>
                <div className="relative w-48 ml-auto">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs bg-card border-border"
                  />
                </div>
              </div>

              {streamsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
                  <h3 className="text-sm font-semibold text-foreground mb-1">No Streams</h3>
                  <p className="text-xs text-muted-foreground">No streams in this category yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
