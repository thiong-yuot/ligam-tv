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
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-xl mx-auto">
          {user && <CreatePostForm />}

          {isLoading ? (
            <div className="space-y-6 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-3">
                    <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground">
                {user ? "Nothing here yet. Be the first to post!" : "Sign in to join the conversation."}
              </p>
            </div>
          ) : (
            <div>
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
