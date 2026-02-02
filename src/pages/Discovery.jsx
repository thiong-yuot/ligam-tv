import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDiscoveryContent } from "@/hooks/useDiscoveryContent";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Clock, Eye, Play } from "lucide-react";

const Discovery = () => {
  const { data: content = [], isLoading } = useDiscoveryContent();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                Discover
              </h1>
            </div>
            <p className="text-muted-foreground">
              Explore curated content and trending topics
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : content.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item.id} className="overflow-hidden group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <Sparkles className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-12 w-12 text-primary" />
                      </div>
                      {item.content_type && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary">{item.content_type}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        {item.view_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{item.view_count} views</span>
                          </div>
                        )}
                        {item.duration_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration_minutes} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No content yet
                </h2>
                <p className="text-muted-foreground">
                  Check back soon for curated discovery content
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Discovery;
