import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, Video, X, Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useFileUpload } from "@/hooks/useFileUpload";

const CreatePostForm = () => {
  const { user, profile } = useAuth();
  const { createPost } = usePosts();
  const { uploadFile, uploading } = useFileUpload();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const displayName = profile?.display_name || profile?.username || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, "post-media", user.id);
      if (url) setMediaFiles((prev) => [...prev, { url, type: "image" }]);
    }
    e.target.value = "";
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "post-media", user.id);
    if (url) setMediaFiles((prev) => [...prev, { url, type: "video" }]);
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return;

    const imageUrls = mediaFiles.filter((m) => m.type === "image").map((m) => m.url);
    const videoFile = mediaFiles.find((m) => m.type === "video");

    let mediaType = "text";
    if (imageUrls.length > 0 && videoFile) mediaType = "mixed";
    else if (videoFile) mediaType = "video";
    else if (imageUrls.length > 0) mediaType = "image";

    await createPost.mutateAsync({
      content: content.trim(),
      media_urls: imageUrls,
      media_type: mediaType,
      video_url: videoFile?.url || undefined,
    });

    setContent("");
    setMediaFiles([]);
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind? Share an idea, video, or stream replay..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
            />

            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mediaFiles.map((media, i) => (
                  <div key={i} className="relative group">
                    {media.type === "image" ? (
                      <img src={media.url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(i)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
                <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={handleVideoUpload} />
                <Button variant="ghost" size="sm" onClick={() => imageInputRef.current?.click()} disabled={uploading}>
                  <Image className="w-4 h-4 mr-1" /> Photo
                </Button>
                <Button variant="ghost" size="sm" onClick={() => videoInputRef.current?.click()} disabled={uploading}>
                  <Video className="w-4 h-4 mr-1" /> Video
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={(!content.trim() && mediaFiles.length === 0) || createPost.isPending || uploading}
              >
                {createPost.isPending || uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Send className="w-4 h-4 mr-1" />
                )}
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
