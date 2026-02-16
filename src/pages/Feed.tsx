import Layout from "@/components/Layout";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Rss } from "lucide-react";

const Feed = () => {
  const { user } = useAuth();
  const { posts, isLoading } = usePosts();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Rss className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          </div>

          {user && (
            <div className="mb-6">
              <CreatePostForm />
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <Rss className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">No posts yet</h2>
              <p className="text-muted-foreground">
                {user ? "Be the first to share something!" : "Sign in to create posts and interact with the community."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
