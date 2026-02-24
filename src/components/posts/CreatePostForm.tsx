import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useFileUpload } from "@/hooks/useFileUpload";

const CreatePostForm = () => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { uploadFile, uploading } = useFileUpload();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: "image" | "video" }[]>([]);
  const [expanded, setExpanded] = useState(false);
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
    setExpanded(false);
  };

  return (
    <div className="border-b border-border/40 pb-4 mb-2">
      <div
        className={`bg-secondary/50 rounded-lg transition-all ${expanded ? "ring-1 ring-primary/30" : ""}`}
        onClick={() => setExpanded(true)}
      >
        <Textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setExpanded(true)}
          className="min-h-[48px] resize-none border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60"
        />
      </div>

      {mediaFiles.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {mediaFiles.map((media, i) => (
            <div key={i} className="relative shrink-0 group">
              {media.type === "image" ? (
                <img src={media.url} alt="" className="h-20 w-20 object-cover rounded-md" />
              ) : (
                <div className="h-20 w-20 bg-secondary rounded-md flex items-center justify-center">
                  <Video className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => removeMedia(i)}
                className="absolute -top-1.5 -right-1.5 bg-background border border-border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {expanded && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-0.5">
            <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
            <input ref={videoInputRef} type="file" accept="video/*" capture="user" hidden onChange={handleVideoUpload} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              <Video className="w-4 h-4" />
            </Button>
          </div>
          <Button
            size="sm"
            className="h-7 px-4 text-xs rounded-full"
            onClick={handleSubmit}
            disabled={(!content.trim() && mediaFiles.length === 0) || createPost.isPending || uploading}
          >
            {(createPost.isPending || uploading) && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
            Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;
