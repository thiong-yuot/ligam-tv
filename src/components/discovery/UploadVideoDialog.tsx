import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Video, X, Loader2, Image } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { useFileUpload } from "@/hooks/useFileUpload";

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadVideoDialog = ({ open, onOpenChange }: UploadVideoDialogProps) => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { uploadFile, uploading } = useFileUpload();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoName(file.name);
    const url = await uploadFile(file, "post-media", `${user.id}/videos`);
    if (url) setVideoUrl(url);
    e.target.value = "";
  };

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "post-media", `${user.id}/thumbnails`);
    if (url) setThumbnailUrl(url);
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!videoUrl || !title.trim()) return;
    setSubmitting(true);
    try {
      await createPost.mutateAsync({
        content: title.trim() + (description ? `\n\n${description}` : ""),
        video_url: videoUrl,
        media_urls: thumbnailUrl ? [thumbnailUrl] : [],
        media_type: "video",
      });
      // Reset
      setTitle("");
      setDescription("");
      setVideoUrl(null);
      setVideoName("");
      setThumbnailUrl(null);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video file */}
          <div>
            <Label className="text-sm mb-1.5 block">Video file *</Label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoSelect}
            />
            {videoUrl ? (
              <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                <Video className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm truncate flex-1">{videoName}</span>
                <button
                  onClick={() => {
                    setVideoUrl(null);
                    setVideoName("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-border/60 rounded-lg p-8 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to select video"}
                </span>
              </button>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <Label className="text-sm mb-1.5 block">Thumbnail (optional)</Label>
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleThumbnailSelect}
            />
            {thumbnailUrl ? (
              <div className="relative w-40">
                <img src={thumbnailUrl} alt="Thumbnail" className="rounded-lg w-40 h-24 object-cover" />
                <button
                  onClick={() => setThumbnailUrl(null)}
                  className="absolute -top-1.5 -right-1.5 bg-background border rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => thumbInputRef.current?.click()}
                disabled={uploading}
                className="gap-1.5"
              >
                <Image className="w-3.5 h-3.5" />
                Add thumbnail
              </Button>
            )}
          </div>

          {/* Title */}
          <div>
            <Label className="text-sm mb-1.5 block">Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm mb-1.5 block">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!videoUrl || !title.trim() || submitting || uploading}
            className="w-full"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadVideoDialog;
