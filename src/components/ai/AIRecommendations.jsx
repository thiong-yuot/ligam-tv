import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Play, BookOpen, ShoppingBag, User, RefreshCw } from "lucide-react";
import { useAIRecommendations } from "@/hooks/useAI";
import { Link } from "react-router-dom";

const RecommendationCard = ({ item }) => {
  const { type, data, reason, score } = item;

  const getIcon = () => {
    switch (type) {
      case "stream": return <Play className="h-4 w-4" />;
      case "course": return <BookOpen className="h-4 w-4" />;
      case "product": return <ShoppingBag className="h-4 w-4" />;
      case "freelancer": return <User className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getLink = () => {
    switch (type) {
      case "stream": return `/stream/${data.id}`;
      case "course": return `/courses/${data.id}`;
      case "product": return `/shop`;
      case "freelancer": return `/freelance/${data.id}`;
      default: return "#";
    }
  };

  const getTitle = () => {
    return data?.title || data?.name || "Recommendation";
  };

  const getDescription = () => {
    return data?.description || data?.bio || "";
  };

  return (
    <Link to={getLink()}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.round(score * 100)}% match
                </span>
              </div>
              <h4 className="font-medium text-sm truncate">{getTitle()}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {getDescription()}
              </p>
              <p className="text-xs text-primary mt-2 italic">
                {reason}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const AIRecommendations = ({ contentType = "all", limit = 6, title = "Recommended for You" }) => {
  const { recommendations, loading, getRecommendations } = useAIRecommendations();

  useEffect(() => {
    getRecommendations(contentType, limit);
  }, [contentType, limit]);

  const handleRefresh = () => {
    getRecommendations(contentType, limit);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((item, i) => (
              <RecommendationCard key={item.id || i} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recommendations available yet.</p>
            <p className="text-sm">Explore the platform to get personalized suggestions!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
