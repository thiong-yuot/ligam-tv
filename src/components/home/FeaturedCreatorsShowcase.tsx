import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  ShoppingBag, 
  GraduationCap, 
  Briefcase, 
  Eye, 
  Star,
  ArrowRight,
  Radio
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CreatorWithContent {
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

// Sample data for demo purposes
const sampleCreators: CreatorWithContent[] = [
  {
    id: "demo-1",
    user_id: "demo-user-1",
    title: "Building a Full-Stack App from Scratch",
    thumbnail_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    viewer_count: 567,
    is_live: true,
    profile: {
      display_name: "Sarah Codes",
      username: "sarahcodes",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    products: [],
    courses: [
      {
        id: "course-1",
        title: "Master React in 30 Days",
        price: 99,
        thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop"
      }
    ],
    freelancer: {
      id: "freelancer-1",
      title: "Full-Stack Web Development",
      hourly_rate: 85
    }
  },
  {
    id: "demo-2",
    user_id: "demo-user-2",
    title: "Pro Gaming Session - Ranked Matches",
    thumbnail_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
    viewer_count: 1234,
    is_live: true,
    profile: {
      display_name: "Marcus Gaming",
      username: "marcusgaming",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    products: [
      {
        id: "product-1",
        name: "Gaming Mousepad XL",
        price: 29,
        image_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop"
      },
      {
        id: "product-2",
        name: "Pro Headset",
        price: 149,
        image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop"
      }
    ],
    courses: [],
    freelancer: null
  },
  {
    id: "demo-3",
    user_id: "demo-user-3",
    title: "Live Music Production Session",
    thumbnail_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop",
    viewer_count: 892,
    is_live: true,
    profile: {
      display_name: "Aria Music",
      username: "ariamusic",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"
    },
    products: [
      {
        id: "product-3",
        name: "Sample Pack Vol.1",
        price: 19,
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
      }
    ],
    courses: [
      {
        id: "course-2",
        title: "Music Production Masterclass",
        price: 149,
        thumbnail_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop"
      }
    ],
    freelancer: {
      id: "freelancer-2",
      title: "Music Production & Mixing",
      hourly_rate: 75
    }
  },
  {
    id: "demo-4",
    user_id: "demo-user-4",
    title: "Morning HIIT Workout - Join Live!",
    thumbnail_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    viewer_count: 445,
    is_live: true,
    profile: {
      display_name: "Alex Fitness",
      username: "alexfitness",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
    },
    products: [
      {
        id: "product-4",
        name: "Resistance Bands Set",
        price: 35,
        image_url: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=200&h=200&fit=crop"
      },
      {
        id: "product-5",
        name: "Protein Shaker",
        price: 15,
        image_url: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&h=200&fit=crop"
      }
    ],
    courses: [
      {
        id: "course-3",
        title: "12-Week Transformation Program",
        price: 79,
        thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop"
      }
    ],
    freelancer: {
      id: "freelancer-3",
      title: "Personal Training & Nutrition",
      hourly_rate: 60
    }
  }
];

const useFeaturedCreators = () => {
  return useQuery({
    queryKey: ["featured-creators-showcase"],
    queryFn: async () => {
      // Fetch streams
      const { data: streams, error: streamsError } = await supabase
        .from("streams")
        .select("id, user_id, title, thumbnail_url, viewer_count, is_live")
        .order("viewer_count", { ascending: false })
        .limit(4);
      
      if (streamsError) throw streamsError;
      
      // If no real streams, return sample data for demo
      if (!streams || streams.length === 0) {
        return sampleCreators;
      }
      
      // Get unique user_ids
      const userIds = [...new Set(streams.map(s => s.user_id))];
      
      // Fetch profiles for these users
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url")
        .in("user_id", userIds);
      
      // Fetch products for these users
      const { data: products } = await supabase
        .from("products")
        .select("id, name, price, image_url, seller_id")
        .in("seller_id", userIds)
        .eq("is_active", true)
        .limit(12);
      
      // Fetch courses for these users
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, price, thumbnail_url, creator_id")
        .in("creator_id", userIds)
        .eq("is_published", true)
        .limit(12);
      
      // Fetch freelancer profiles for these users
      const { data: freelancers } = await supabase
        .from("freelancers")
        .select("id, title, hourly_rate, user_id")
        .in("user_id", userIds);
      
      // Combine data
      const creatorsWithContent: CreatorWithContent[] = streams.map(stream => {
        const userProfile = (profiles || []).find(p => p.user_id === stream.user_id);
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
          products: (products || [])
            .filter(p => p.seller_id === stream.user_id)
            .slice(0, 3)
            .map(p => ({ id: p.id, name: p.name, price: p.price, image_url: p.image_url })),
          courses: (courses || [])
            .filter(c => c.creator_id === stream.user_id)
            .slice(0, 2)
            .map(c => ({ id: c.id, title: c.title, price: c.price, thumbnail_url: c.thumbnail_url })),
          freelancer: (freelancers || []).find(f => f.user_id === stream.user_id) 
            ? { 
                id: freelancers!.find(f => f.user_id === stream.user_id)!.id,
                title: freelancers!.find(f => f.user_id === stream.user_id)!.title,
                hourly_rate: freelancers!.find(f => f.user_id === stream.user_id)!.hourly_rate
              }
            : null
        };
      });
      
      return creatorsWithContent;
    },
  });
};

const CreatorCard = ({ creator }: { creator: CreatorWithContent }) => {
  const formatViewers = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
      {/* Stream Preview */}
      <Link to={`/stream/${creator.id}`} className="block relative">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={creator.thumbnail_url || "/placeholder.svg"}
            alt={creator.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {/* Live Badge */}
          {creator.is_live && (
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
              <span className="px-2 py-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatViewers(creator.viewer_count || 0)}
              </span>
            </div>
          )}
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </div>
          
          {/* Creator Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
            <img
              src={creator.profile?.avatar_url || "/placeholder.svg"}
              alt={creator.profile?.display_name || "Creator"}
              className="w-10 h-10 rounded-full border-2 border-primary object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate text-sm">
                {creator.profile?.display_name || creator.profile?.username || "Creator"}
              </h3>
              <p className="text-white/70 text-xs truncate">{creator.title}</p>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Creator Services */}
      <div className="p-4 space-y-3">
        {/* Store Products */}
        {creator.products.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              <span>Store</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {creator.products.map(product => (
                <Link
                  key={product.id}
                  to={`/shop`}
                  className="flex-shrink-0 group/product"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border group-hover/product:border-primary transition-colors">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs mt-1 truncate w-16 text-muted-foreground">${product.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Courses */}
        {creator.courses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span>Courses</span>
            </div>
            <div className="space-y-1">
              {creator.courses.map(course => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/course"
                >
                  <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={course.thumbnail_url || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover/course:text-primary transition-colors">
                      {course.title}
                    </p>
                    <p className="text-xs text-primary font-semibold">${course.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Freelance Gig */}
        {creator.freelancer && (
          <Link
            to={`/freelancer/${creator.freelancer.id}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20"
          >
            <Briefcase className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{creator.freelancer.title}</p>
              {creator.freelancer.hourly_rate && (
                <p className="text-xs text-muted-foreground">
                  From ${creator.freelancer.hourly_rate}/hr
                </p>
              )}
            </div>
            <Badge variant="secondary" className="flex-shrink-0">Hire</Badge>
          </Link>
        )}
        
        {/* Empty State */}
        {creator.products.length === 0 && creator.courses.length === 0 && !creator.freelancer && (
          <p className="text-xs text-muted-foreground text-center py-2">
            No services available yet
          </p>
        )}
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-20" />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <Skeleton className="w-16 h-16 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

const FeaturedCreatorsShowcase = () => {
  const { data: creators = [], isLoading } = useFeaturedCreators();

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Featured Creators
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Stream • Shop • Learn • Hire
            </span>
          </div>
          <Link to="/browse">
            <Button variant="ghost" className="group">
              Explore All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Creators Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : creators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.map((creator, index) => (
              <div
                key={creator.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CreatorCard creator={creator} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-border">
            <Radio className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No creators yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to start streaming and showcase your services!
            </p>
            <Link to="/go-live">
              <Button>Start Streaming</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCreatorsShowcase;
