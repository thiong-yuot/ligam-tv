import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreamCard from "@/components/StreamCard";
import StatsBar from "@/components/StatsBar";
import CategoryFilter from "@/components/CategoryFilter";
import VirtualGifts from "@/components/VirtualGifts";
import WhyChooseLigam from "@/components/WhyChooseLigam";
import GetFeatured from "@/components/GetFeatured";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
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

  const liveStreamCount = streams.filter(s => s.is_live).length;
  const categoryCount = categories.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Stream, Connect <span className="text-primary">&</span> Monetize
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join creators building their communities on Ligam. Stream live, engage with viewers, and earn from your passion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/create-profile">
              <Button variant="default" size="xl" className="glow">
                Start Streaming
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" size="xl">
                Explore Streams
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            All sign-ups and logins are securely handled with industry-standard encryption.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-4 border-y border-border bg-card/30">
        <div className="container mx-auto">
          <StatsBar 
            liveStreams={liveStreamCount} 
            categories={categoryCount} 
          />
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <CategoryFilter 
            categories={categoryNames}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Live Streams Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              {activeCategory === "All" ? "All Live Streams" : `${activeCategory} Streams`}
            </h2>
            <span className="text-muted-foreground">
              {filteredStreams.length} {filteredStreams.length === 1 ? "stream" : "streams"} live
            </span>
          </div>

          {streamsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStreams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStreams.map((stream, index) => (
                <div
                  key={stream.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
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
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No live streams right now
              </h3>
              <p className="text-muted-foreground mb-6">
                Be the first to go live and start streaming!
              </p>
              <Link to="/go-live">
                <Button variant="default">
                  Start Streaming
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-12 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
            Trending Categories
          </h2>
          <p className="text-muted-foreground mb-8">Popular categories to explore</p>
          
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category) => (
                <Link 
                  key={category.id} 
                  to={`/browse?category=${encodeURIComponent(category.name)}`}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all text-center group"
                >
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
        </div>
      </section>

      {/* Why Choose Ligam */}
      <WhyChooseLigam />

      {/* Virtual Gifts */}
      <VirtualGifts />

      {/* Get Featured */}
      <GetFeatured />

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            Ready to Start Streaming?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join creators building their communities on Ligam. Start streaming today and reach your audience.
          </p>
          <Link to="/create-profile">
            <Button variant="default" size="xl" className="glow">
              Start Streaming Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Bottom Stats */}
      <section className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <StatsBar 
            liveStreams={liveStreamCount} 
            categories={categoryCount} 
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
