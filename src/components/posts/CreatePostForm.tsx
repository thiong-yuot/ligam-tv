import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, X, Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useFileUpload } from "@/hooks/useFileUpload";

const CreatePostForm = () => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { uploadFile, uploading } = useFileUpload();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

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
      <CardContent className="p-4 space-y-3">
        <Textarea
          placeholder="Share an idea, video, or stream replay..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[70px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
        />

        {mediaFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mediaFiles.map((media, i) => (
              <div key={i} className="relative group">
                {media.type === "image" ? (
                  <img src={media.url} alt="" className="w-16 h-16 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Video className="w-5 h-5 text-muted-foreground" />
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
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => imageInputRef.current?.click()} disabled={uploading}>
              <Image className="w-3.5 h-3.5 mr-1" /> Photo
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => videoInputRef.current?.click()} disabled={uploading}>
              <Video className="w-3.5 h-3.5 mr-1" /> Video
            </Button>
          </div>
          <Button
            size="sm"
            className="h-8"
            onClick={handleSubmit}
            disabled={(!content.trim() && mediaFiles.length === 0) || createPost.isPending || uploading}
          >
            {createPost.isPending || uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="ml-1">Post</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
