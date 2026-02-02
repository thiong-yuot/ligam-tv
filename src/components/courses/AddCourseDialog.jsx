import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, Loader2, Crown, AlertTriangle, Upload, Image, Video } from "lucide-react";
import { useCreateCourse, COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/hooks/useAuth";

const AddCourseDialog = ({ disabled, children }) => {
  const { user } = useAuth();
  const { uploadFile, uploading } = useFileUpload();
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");

  const createCourse = useCreateCourse();
  const { canAddCourse, getMaxCourses, getCurrentCourseCount, getRemainingCourses, tier, getUpgradeMessage } = useFeatureAccess();

  const maxCourses = getMaxCourses();
  const currentCount = getCurrentCourseCount();
  const remainingSlots = getRemainingCourses();
  const canAdd = canAddCourse();

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "course-content", user.id);
    if (url) setThumbnailUrl(url);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "course-content", user.id);
    if (url) setPreviewVideoUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAdd) {
      return;
    }
    
    await createCourse.mutateAsync({
      title,
      short_description: shortDescription,
      description,
      price: parseFloat(price) || 0,
      category,
      level,
      thumbnail_url: thumbnailUrl || null,
      preview_video_url: previewVideoUrl || null,
    });

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setShortDescription("");
    setDescription("");
    setPrice("");
    setCategory("");
    setLevel("beginner");
    setThumbnailUrl("");
    setPreviewVideoUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button disabled={disabled} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>

        {/* Show tier limit info */}
        {maxCourses !== Infinity && (
          <div className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span>
                {currentCount} / {maxCourses} courses used
              </span>
            </div>
            {remainingSlots > 0 ? (
              <span className="text-muted-foreground">
                {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} remaining
              </span>
            ) : (
              <Link to="/pricing">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Show upgrade warning if at limit */}
        {!canAdd && (
          <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Course Limit Reached</AlertTitle>
            <AlertDescription>
              {getUpgradeMessage("course")}
              <Link to="/pricing" className="block mt-2">
                <Button size="sm" variant="outline">
                  View Plans
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete Web Development Bootcamp"
              required
              disabled={!canAdd}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary of your course"
              maxLength={150}
              disabled={!canAdd}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what students will learn..."
              rows={4}
              disabled={!canAdd}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00 for free"
                disabled={!canAdd}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={level} onValueChange={setLevel} disabled={!canAdd}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_LEVELS.map((lvl) => (
                    <SelectItem key={lvl} value={lvl} className="capitalize">
                      {lvl.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={!canAdd}>
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

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label>Course Thumbnail</Label>
            <div className="flex items-center gap-4">
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt="Thumbnail" className="h-20 w-32 object-cover rounded-lg" />
              )}
              <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
              <Button type="button" variant="outline" onClick={() => thumbnailInputRef.current?.click()} disabled={!canAdd || uploading}>
                <Image className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : thumbnailUrl ? "Change" : "Upload Thumbnail"}
              </Button>
            </div>
          </div>

          {/* Preview Video Upload */}
          <div className="space-y-2">
            <Label>Preview Video (Optional)</Label>
            <div className="flex items-center gap-4">
              {previewVideoUrl && (
                <video src={previewVideoUrl} className="h-20 w-32 object-cover rounded-lg" controls />
              )}
              <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              <Button type="button" variant="outline" onClick={() => videoInputRef.current?.click()} disabled={!canAdd || uploading}>
                <Video className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : previewVideoUrl ? "Change" : "Upload Video"}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCourse.isPending || !title || !canAdd}>
              {createCourse.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;