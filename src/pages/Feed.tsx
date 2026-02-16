import Layout from "@/components/Layout";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const Feed = () => {
  const { user } = useAuth();
  const { posts, isLoading } = usePosts();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-lg font-semibold text-foreground mb-4">Feed</h1>

          {user && (
            <div className="mb-4">
              <CreatePostForm />
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                {user ? "Be the first to share something!" : "Sign in to create posts."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
