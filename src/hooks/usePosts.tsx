import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_urls: string[];
  media_type: string;
  video_url: string | null;
  stream_id: string | null;
  is_stream_replay: boolean;
  like_count: number;
  comment_count: number;
  view_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
  user_has_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const usePosts = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles for all posts
      const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, is_verified")
        .in("user_id", userIds);

      // Check if current user has liked each post
      let likedPostIds: string[] = [];
      if (user) {
        const { data: likes } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", (data || []).map((p: any) => p.id));
        likedPostIds = (likes || []).map((l: any) => l.post_id);
      }

      const profileMap = new Map(
        (profiles || []).map((p: any) => [p.user_id, p])
      );

      return (data || []).map((post: any) => ({
        ...post,
        profile: profileMap.get(post.user_id),
        user_has_liked: likedPostIds.includes(post.id),
      })) as Post[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (postData: {
      content?: string;
      media_urls?: string[];
      media_type?: string;
      video_url?: string;
      stream_id?: string;
      is_stream_replay?: boolean;
    }) => {
      if (!user) throw new Error("Must be logged in");
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content: postData.content || null,
          media_urls: postData.media_urls || [],
          media_type: postData.media_type || "text",
          video_url: postData.video_url || null,
          stream_id: postData.stream_id || null,
          is_stream_replay: postData.is_stream_replay || false,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Post published!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({ title: "Post deleted" });
    },
  });

  const toggleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user) throw new Error("Must be logged in");
      if (isLiked) {
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
        await supabase.rpc("decrement_post_likes", { post_id_param: postId });
      } else {
        await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
        await supabase.rpc("increment_post_likes", { post_id_param: postId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { posts, isLoading, createPost, deletePost, toggleLike };
};

export const usePostComments = (postId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const userIds = [...new Set((data || []).map((c: any) => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p: any) => [p.user_id, p])
      );

      return (data || []).map((comment: any) => ({
        ...comment,
        profile: profileMap.get(comment.user_id),
      })) as PostComment[];
    },
    enabled: !!postId,
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase
        .from("post_comments")
        .insert({ post_id: postId, user_id: user.id, content });
      if (error) throw error;
      await supabase.rpc("increment_post_comments", { post_id_param: postId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from("post_comments").delete().eq("id", commentId);
      if (error) throw error;
      await supabase.rpc("decrement_post_comments", { post_id_param: postId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { comments, isLoading, addComment, deleteComment };
};
