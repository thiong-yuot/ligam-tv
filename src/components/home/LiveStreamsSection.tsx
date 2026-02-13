import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  Eye, 
  ArrowRight,
  Radio,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StreamWithServices {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string | null;
  viewer_count: number | null;
  is_live: boolean | null;
  profile: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  category: {
    name: string;
  } | null;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  }[];
  courses: {
    id: string;
    title: string;
    price: number;
    thumbnail_url: string | null;
  }[];
  freelancer: {
    id: string;
    title: string;
    hourly_rate: number | null;
  } | null;
}

// No more sample data - using real database data only

// Hook to fetch streams with their associated services
const useLiveStreamsWithServices = () => {
  return useQuery({
    queryKey: ["live-streams-with-services"],
    queryFn: async () => {
      // Fetch live streams
      const { data: streams, error: streamsError } = await supabase
        .from("streams")
        .select(`
          id, 
          user_id, 
          title, 
          thumbnail_url, 
          viewer_count, 
          is_live,
          category_id
        `)
        .eq("is_live", true)
        .order("viewer_count", { ascending: false })
        .limit(6);
      
      if (streamsError) throw streamsError;
      
      // If no live streams, return empty array
      if (!streams || streams.length === 0) {
        return [];
      }
      
      // Get unique user_ids and category_ids
      const userIds = [...new Set(streams.map(s => s.user_id))];
      const categoryIds = [...new Set(streams.map(s => s.category_id).filter(Boolean))];
      
      // Fetch all related data in parallel
      const [profilesRes, categoriesRes, productsRes, coursesRes, freelancersRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, display_name, username, avatar_url")
          .in("user_id", userIds),
        categoryIds.length > 0 
          ? supabase.from("categories").select("id, name").in("id", categoryIds)
          : Promise.resolve({ data: [] }),
        supabase
          .from("products")
          .select("id, name, price, image_url, seller_id")
          .in("seller_id", userIds)
          .eq("is_active", true),
        supabase
          .from("courses")
          .select("id, title, price, thumbnail_url, creator_id")
          .in("creator_id", userIds)
          .eq("is_published", true),
        supabase
          .from("freelancers")
          .select("id, title, hourly_rate, user_id")
          .in("user_id", userIds)
      ]);
      
      const profiles = profilesRes.data || [];
      const categories = categoriesRes.data || [];
      const products = productsRes.data || [];
      const courses = coursesRes.data || [];
      const freelancers = freelancersRes.data || [];
      
      // Combine data
      const streamsWithServices: StreamWithServices[] = streams.map(stream => {
        const userProfile = profiles.find(p => p.user_id === stream.user_id);
        const category = categories.find(c => c.id === stream.category_id);
        
        return {
          id: stream.id,
          user_id: stream.user_id,
          title: stream.title,
          thumbnail_url: stream.thumbnail_url,
          viewer_count: stream.viewer_count,
          is_live: stream.is_live,
          profile: userProfile ? {
            display_name: userProfile.display_name,
            username: userProfile.username,
            avatar_url: userProfile.avatar_url
          } : null,
          category: category ? { name: category.name } : null,
          products: products
            .filter(p => p.seller_id === stream.user_id)
            .slice(0, 2)
            .map(p => ({ id: p.id, name: p.name, price: p.price, image_url: p.image_url })),
          courses: courses
            .filter(c => c.creator_id === stream.user_id)
            .slice(0, 2)
            .map(c => ({ id: c.id, title: c.title, price: c.price, thumbnail_url: c.thumbnail_url })),
          freelancer: freelancers.find(f => f.user_id === stream.user_id) 
            ? { 
                id: freelancers.find(f => f.user_id === stream.user_id)!.id,
                title: freelancers.find(f => f.user_id === stream.user_id)!.title,
                hourly_rate: freelancers.find(f => f.user_id === stream.user_id)!.hourly_rate
              }
            : null
        };
      });
      
      return streamsWithServices;
    },
    staleTime: 30000, // Cache for 30 seconds
  });
};

const formatViewers = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const StreamCardWithServices = ({ stream, index }: { stream: StreamWithServices; index: number }) => {
  // Show different service combinations based on stream index
  const showProducts = index === 0 || index === 2;
  const showCourses = index === 0 || index === 1;
  const showFreelancer = index === 1 || index === 2;
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-muted-foreground/30 transition-all duration-300 group">
      {/* Stream Preview */}
      <Link to={`/stream/${stream.id}`} className="block relative">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={stream.thumbnail_url || "/placeholder.svg"}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-background/60" />
          
          {stream.is_live && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded flex items-center gap-1">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
              <span className="px-1.5 py-0.5 bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-medium rounded flex items-center gap-1">
                <Eye className="w-2.5 h-2.5" />
                {formatViewers(stream.viewer_count || 0)}
              </span>
            </div>
          )}
          
          {stream.category && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded">
                {stream.category.name}
              </span>
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
            </div>
          </div>
          
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-primary bg-secondary flex items-center justify-center">
              <span className="text-[10px] font-bold text-foreground">
                {(stream.profile?.display_name || stream.profile?.username || "C").charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate text-xs">
                {stream.profile?.display_name || stream.profile?.username || "Creator"}
              </h3>
              <p className="text-white/70 text-[10px] truncate">{stream.title}</p>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Creator Services - Show different combinations per card */}
      <div className="p-2.5 space-y-2">
        {/* Store Products - Only show for some cards */}
        {showProducts && stream.products.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span>Store</span>
            </div>
            <div className="flex gap-2">
              {stream.products.slice(0, 2).map(product => (
                <Link
                  key={product.id}
                  to="/shop"
                  className="flex-shrink-0 group/product"
                >
                  <div className="w-10 h-10 rounded overflow-hidden border border-border group-hover/product:border-primary transition-colors">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] mt-0.5 truncate w-10 text-muted-foreground">${product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Courses - Only show for some cards */}
        {showCourses && stream.courses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>Courses</span>
            </div>
            <Link
              to={`/courses/${stream.courses[0].id}`}
              className="flex items-center gap-2 p-1.5 rounded bg-muted/50 hover:bg-muted transition-colors group/course"
            >
              <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                <img
                  src={stream.courses[0].thumbnail_url || "/placeholder.svg"}
                  alt={stream.courses[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate group-hover/course:text-primary transition-colors">
                  {stream.courses[0].title}
                </p>
                <p className="text-xs text-primary font-semibold">${stream.courses[0].price}</p>
              </div>
            </Link>
          </div>
        )}
        
        {/* Freelance Gig - Only show for some cards */}
        {showFreelancer && stream.freelancer && (
          <Link
            to={`/freelance/${stream.freelancer.id}`}
            className="flex items-center gap-2 p-1.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <Briefcase className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{stream.freelancer.title}</p>
              {stream.freelancer.hourly_rate && (
                <p className="text-xs text-muted-foreground">
                  From ${stream.freelancer.hourly_rate}/hr
                </p>
              )}
            </div>
            <Badge variant="secondary" className="flex-shrink-0 text-xs">Hire</Badge>
          </Link>
        )}
        
        {/* Empty State - Only if nothing shown for this card */}
        {!showProducts && !showCourses && !showFreelancer && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Watching stream...
          </p>
        )}
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <div className="p-2.5 space-y-2">
      <Skeleton className="h-3 w-16" />
      <div className="flex gap-2">
        <Skeleton className="w-10 h-10 rounded" />
        <Skeleton className="w-10 h-10 rounded" />
      </div>
    </div>
  </div>
);

const LiveStreamsSection = () => {
  const { data: streams = [], isLoading } = useLiveStreamsWithServices();
  const liveCount = streams.filter(s => s.is_live).length;

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-destructive animate-pulse" />
            <h2 className="text-lg font-display font-bold text-foreground">Live Now</h2>
          </div>
          <Link to="/browse">
            <Button variant="ghost" size="sm">View All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
          </Link>
        </div>

        {/* Streams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : streams.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {streams.slice(0, 6).map((stream, index) => (
              <div
                key={stream.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <StreamCardWithServices stream={stream} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <Radio className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
            <h3 className="text-sm font-semibold text-foreground mb-1">No one is live</h3>
            <p className="text-xs text-muted-foreground mb-3">Be the first to go live!</p>
            <Link to="/go-live">
              <Button size="sm">Start Streaming</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveStreamsSection;
