import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  Users, 
  Eye, 
  PlayCircle,
  BookOpen,
  ShoppingBag,
  Briefcase,
  MessageCircle,
  Globe,
  FileText,
  UserPlus,
  UserMinus
} from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import ProductCard from "@/components/shop/ProductCard";
import { useCart } from "@/hooks/useCart";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useIsFollowing, useFollowUser, useUnfollowUser } from "@/hooks/useFollowers";
import PostCard from "@/components/posts/PostCard";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["public-profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!username,
  });

  const { data: isFollowing = false } = useIsFollowing(profile?.user_id || "");
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const { data: courses = [] } = useQuery({
    queryKey: ["user-courses", profile?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("creator_id", profile?.user_id)
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.user_id,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["user-products", profile?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", profile?.user_id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.user_id,
  });

  const { data: streams = [] } = useQuery({
    queryKey: ["user-streams", profile?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("streams")
        .select("*")
        .eq("user_id", profile?.user_id)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.user_id,
  });

  const { data: freelancer } = useQuery({
    queryKey: ["user-freelancer", profile?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("user_id", profile?.user_id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.user_id,
  });

  const { posts: userPosts } = usePosts(profile?.user_id);

  const isOwnProfile = user?.id === profile?.user_id;

  const handleMessage = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (profile?.user_id) {
      navigate(`/messages?user=${profile.user_id}`);
    }
  };

  const handleFollow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!profile?.user_id) return;

    if (isFollowing) {
      unfollowUser.mutate(profile.user_id, {
        onSuccess: () => toast({ title: "Unfollowed" }),
      });
    } else {
      followUser.mutate(profile.user_id, {
        onSuccess: () => toast({ title: "Following!" }),
      });
    }
  };

  if (profileLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-lg font-bold text-foreground mb-2">User Not Found</h1>
          <p className="text-xs text-muted-foreground mb-4">This profile doesn't exist.</p>
          <Button size="sm" asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const displayName = profile.display_name || profile.username || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground truncate">{displayName}</h1>
              {profile.is_verified && (
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">@{profile.username}</p>

            {/* Inline stats */}
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span><strong className="text-foreground">{profile.follower_count?.toLocaleString() || 0}</strong> followers</span>
              <span><strong className="text-foreground">{profile.total_views?.toLocaleString() || 0}</strong> views</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-foreground/80 leading-relaxed">{profile.bio}</p>
        )}

        {/* Education & Website */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {(profile.university || profile.degree) && (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {profile.degree}{profile.field_of_study && ` in ${profile.field_of_study}`}{profile.university && ` — ${profile.university}`}
            </span>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              <Globe className="w-3 h-3" />
              Website
            </a>
          )}
        </div>

        {/* Action buttons */}
        {!isOwnProfile && (
          <div className="flex gap-2">
            <Button size="sm" className="h-8 text-xs" onClick={handleMessage}>
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Message
            </Button>
            <Button
              size="sm"
              variant={isFollowing ? "outline" : "secondary"}
              className="h-8 text-xs"
              onClick={handleFollow}
              disabled={followUser.isPending || unfollowUser.isPending}
            >
              {isFollowing ? (
                <><UserMinus className="w-3.5 h-3.5 mr-1.5" />Unfollow</>
              ) : (
                <><UserPlus className="w-3.5 h-3.5 mr-1.5" />Follow</>
              )}
            </Button>
          </div>
        )}

        {/* Content sections — only show sections that have data */}
        {streams.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-primary" />
              Streams ({streams.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {streams.map((stream) => (
                <Link key={stream.id} to={`/stream/${stream.id}`} className="group">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    {stream.thumbnail_url ? (
                      <img src={stream.thumbnail_url} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    {stream.is_live && (
                      <Badge className="absolute top-1.5 left-1.5 bg-destructive text-[10px] h-5 px-1.5">LIVE</Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1.5 line-clamp-1">{stream.title}</p>
                  <p className="text-[10px] text-muted-foreground">{stream.viewer_count?.toLocaleString() || 0} viewers</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {courses.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Courses ({courses.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} showInstructor={false} />
              ))}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              Products ({products.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </section>
        )}

        {freelancer && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Services
            </h2>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">{freelancer.title}</p>
              {freelancer.bio && <p className="text-xs text-muted-foreground">{freelancer.bio}</p>}
              {freelancer.skills && freelancer.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {freelancer.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[10px] h-5">{skill}</Badge>
                  ))}
                </div>
              )}
              <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                <Link to={`/freelance/${freelancer.id}`}>View services</Link>
              </Button>
            </div>
          </section>
        )}

        {userPosts.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Posts ({userPosts.length})
            </h2>
            <div className="space-y-3">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {courses.length === 0 && products.length === 0 && streams.length === 0 && !freelancer && userPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xs text-muted-foreground">No content yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
