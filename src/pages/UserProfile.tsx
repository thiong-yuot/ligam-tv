import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  Users, 
  Eye, 
  Globe, 
  PlayCircle,
  BookOpen,
  ShoppingBag,
  Briefcase,
  MessageCircle
} from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import ProductCard from "@/components/shop/ProductCard";
import { useCart } from "@/hooks/useCart";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/posts/PostCard";
import { FileText } from "lucide-react";

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { addToCart } = useCart();
  
  // Fetch profile by username
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

  // Fetch courses by this creator
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

  // Fetch products by this seller
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

  // Fetch streams by this user
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

  // Fetch freelancer profile if exists
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

  // Fetch posts by this user
  const { posts: userPosts } = usePosts(profile?.user_id);

  if (profileLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 mb-8">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">User Not Found</h1>
          <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const displayName = profile.display_name || profile.username || "User";
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const totalStudents = courses.reduce((sum, c) => sum + (c.total_enrollments || 0), 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                {profile.is_verified && (
                  <Badge className="bg-primary text-primary-foreground">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mb-4">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-foreground/80 mb-4 max-w-2xl">{profile.bio}</p>
              )}
              
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
                >
                  <Globe className="w-4 h-4" />
                  {profile.website}
                </a>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-bold text-foreground">{profile.follower_count?.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-primary mb-1">
                    <Eye className="w-4 h-4" />
                  </div>
                  <p className="text-xl font-bold text-foreground">{profile.total_views?.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
                {courses.length > 0 && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-bold text-foreground">{totalStudents.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                )}
                {freelancer && (
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-bold text-foreground">{freelancer.total_jobs || 0}</p>
                    <p className="text-xs text-muted-foreground">Jobs Done</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button>
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline">Follow</Button>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue={userPosts.length > 0 ? "posts" : courses.length > 0 ? "courses" : "streams"} className="w-full">
            <TabsList className="mb-6">
              {courses.length > 0 && (
                <TabsTrigger value="courses" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Courses ({courses.length})
                </TabsTrigger>
              )}
              {products.length > 0 && (
                <TabsTrigger value="products" className="gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Products ({products.length})
                </TabsTrigger>
              )}
              {streams.length > 0 && (
                <TabsTrigger value="streams" className="gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Streams ({streams.length})
                </TabsTrigger>
              )}
              {freelancer && (
                <TabsTrigger value="services" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  Services
                </TabsTrigger>
              )}
              <TabsTrigger value="posts" className="gap-2">
                <FileText className="w-4 h-4" />
                Posts {userPosts.length > 0 && `(${userPosts.length})`}
              </TabsTrigger>
            </TabsList>

            {courses.length > 0 && (
              <TabsContent value="courses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} showInstructor={false} />
                  ))}
                </div>
              </TabsContent>
            )}

            {products.length > 0 && (
              <TabsContent value="products">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </TabsContent>
            )}

            {streams.length > 0 && (
              <TabsContent value="streams">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {streams.map((stream) => (
                    <Link key={stream.id} to={`/stream/${stream.id}`}>
                      <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                        <div className="aspect-video bg-muted relative">
                          {stream.thumbnail_url ? (
                            <img 
                              src={stream.thumbnail_url} 
                              alt={stream.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PlayCircle className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                          {stream.is_live && (
                            <Badge className="absolute top-2 left-2 bg-destructive">LIVE</Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-1">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {stream.viewer_count?.toLocaleString() || 0} viewers
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            )}

            {freelancer && (
              <TabsContent value="services">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      {freelancer.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{freelancer.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.skills?.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                    {freelancer.hourly_rate && (
                      <p className="text-lg font-bold text-primary">
                        ${freelancer.hourly_rate}/hour
                      </p>
                    )}
                    <Button className="mt-4" asChild>
                      <Link to={`/freelance/${freelancer.id}`}>View Full Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="posts">
              {userPosts.length > 0 ? (
                <div className="max-w-2xl space-y-4">
                  {userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">No posts yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Empty state if no content */}
          {courses.length === 0 && products.length === 0 && streams.length === 0 && !freelancer && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">This creator hasn't published any content yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
