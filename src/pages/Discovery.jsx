import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscoveryContent, useFeaturedContent } from "@/hooks/useDiscoveryContent";
import { Play, Clock, Eye, Sparkles, TrendingUp, Newspaper } from "lucide-react";
import { format } from "date-fns";

const Discovery = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { data: content, isLoading } = useDiscoveryContent();
  const { data: featuredContent } = useFeaturedContent();

  const filteredContent = content?.filter((item) => {
    if (activeTab === "all") return true;
    return item.content_type === activeTab;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Discovery</h1>
              <p className="text-muted-foreground">
                Explore curated content and trending topics
              </p>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        {featuredContent && featuredContent.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredContent.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.thumbnail_url && (
                    <div className="relative aspect-video">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Button size="icon" variant="secondary" className="rounded-full">
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{item.content_type}</Badge>
                      {item.source_name && (
                        <span className="text-xs text-muted-foreground">
                          {item.source_name}
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {item.duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.duration_minutes} min
                        </span>
                      )}
                      {item.view_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.view_count.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="podcast">Podcasts</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video" />
                    <CardHeader>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredContent && filteredContent.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {item.thumbnail_url && (
                      <div className="relative aspect-video">
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.video_url && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="secondary" className="rounded-full">
                              <Play className="h-5 w-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.content_type}
                        </Badge>
                        {item.published_at && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.published_at), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {item.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.duration_minutes} min
                          </span>
                        )}
                        {item.view_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.view_count.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No content yet</h3>
                <p className="text-muted-foreground">
                  Check back later for new discoveries
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Discovery;
