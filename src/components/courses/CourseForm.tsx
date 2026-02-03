import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Video, Image } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/hooks/useAuth";
import { COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";

interface CourseFormProps {
  initialData?: {
    title: string;
    description: string;
    short_description: string;
    price: number;
    category: string;
    level: string;
    language: string;
    thumbnail_url: string;
    preview_video_url: string;
    is_published: boolean;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CourseForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: CourseFormProps) => {
  const { user } = useAuth();
  const { uploadFile, uploading } = useFileUpload();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    level: initialData?.level || "beginner",
    language: initialData?.language || "English",
    thumbnail_url: initialData?.thumbnail_url || "",
    preview_video_url: initialData?.preview_video_url || "",
    is_published: initialData?.is_published || false,
  });

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "course-content", user.id);
    if (url) setFormData((prev) => ({ ...prev, thumbnail_url: url }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "course-content", user.id);
    if (url) setFormData((prev) => ({ ...prev, preview_video_url: url }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Complete Video Editing Masterclass"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, short_description: e.target.value }))
              }
              placeholder="A brief summary for listings..."
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Detailed course description..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={formData.language}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, language: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Course Thumbnail</Label>
            <div className="flex items-center gap-4">
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail"
                  className="h-24 w-40 object-cover rounded-lg"
                />
              )}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={uploading}
              >
                <Image className="h-4 w-4 mr-2" />
                {formData.thumbnail_url ? "Change Thumbnail" : "Upload Thumbnail"}
              </Button>
            </div>
          </div>

          {/* Preview Video */}
          <div className="space-y-2">
            <Label>Preview Video</Label>
            <div className="flex items-center gap-4">
              {formData.preview_video_url && (
                <video
                  src={formData.preview_video_url}
                  className="h-24 w-40 object-cover rounded-lg"
                  controls
                />
              )}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
              >
                <Video className="h-4 w-4 mr-2" />
                {formData.preview_video_url ? "Change Video" : "Upload Preview Video"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_published: checked }))
              }
            />
            <Label htmlFor="is_published">Publish Course</Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Published courses are visible to all users and available for enrollment.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={isLoading || uploading}>
          {isLoading ? "Saving..." : "Save Course"}
        </Button>
      </div>
    </form>
  );
};
