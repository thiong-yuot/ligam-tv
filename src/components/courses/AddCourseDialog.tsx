import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2, Image, Video, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useCreateCourse, useCreateSection, useCreateLesson, COURSE_CATEGORIES, COURSE_LEVELS } from "@/hooks/useCourses";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AddCourseDialogProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

interface LessonInput {
  title: string;
  videoUrl: string;
  uploading: boolean;
}

const AddCourseDialog = ({ disabled, children }: AddCourseDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadFile, uploading: thumbnailUploading } = useFileUpload();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1=details, 2=lesson count, 3=lessons

  // Step 1: Course details
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("beginner");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Step 2: Lesson count
  const [lessonCount, setLessonCount] = useState(1);

  // Step 3: Lessons
  const [lessons, setLessons] = useState<LessonInput[]>([]);

  const createCourse = useCreateCourse();
  const createSection = useCreateSection();
  const createLesson = useCreateLesson();
  const [submitting, setSubmitting] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = await uploadFile(file, "course-content", user.id);
    if (url) setThumbnailUrl(url);
  };

  const handleLessonVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLessons(prev => prev.map((l, i) => i === index ? { ...l, uploading: true } : l));

    const url = await uploadFile(file, "course-content", user.id);
    if (url) {
      setLessons(prev => prev.map((l, i) => i === index ? { ...l, videoUrl: url, uploading: false } : l));
    } else {
      setLessons(prev => prev.map((l, i) => i === index ? { ...l, uploading: false } : l));
    }
  };

  const goToStep2 = () => {
    if (!title.trim()) return;
    setStep(2);
  };

  const goToStep3 = () => {
    const count = Math.max(1, Math.min(50, lessonCount));
    setLessonCount(count);
    setLessons(
      Array.from({ length: count }, (_, i) => ({
        title: `Lesson ${i + 1}`,
        videoUrl: "",
        uploading: false,
      }))
    );
    setStep(3);
  };

  const updateLessonTitle = (index: number, value: string) => {
    setLessons(prev => prev.map((l, i) => i === index ? { ...l, title: value } : l));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // 1. Create the course
      const course = await createCourse.mutateAsync({
        title,
        short_description: shortDescription,
        description,
        price: parseFloat(price) || 0,
        category,
        level,
        thumbnail_url: thumbnailUrl || null,
        total_lessons: lessons.length,
      });

      // 2. Create a default section
      const section = await createSection.mutateAsync({
        course_id: course.id,
        title: "Course Content",
        sort_order: 0,
      });

      // 3. Create each lesson
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        await createLesson.mutateAsync({
          section_id: section.id,
          title: lesson.title,
          video_url: lesson.videoUrl || undefined,
          sort_order: i,
        });
      }

      toast({ title: "Course created with all lessons!" });
      setOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Failed to create course", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setShortDescription("");
    setDescription("");
    setPrice("");
    setCategory("");
    setLevel("beginner");
    setThumbnailUrl("");
    setLessonCount(1);
    setLessons([]);
  };

  const anyLessonUploading = lessons.some(l => l.uploading);
  const allLessonsHaveVideo = lessons.length > 0 && lessons.every(l => l.videoUrl && l.title.trim());

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        {children || (
          <Button disabled={disabled} size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Add Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            {step === 1 && "Course Details"}
            {step === 2 && "How many lessons?"}
            {step === 3 && "Add Your Lessons"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">Step {step} of 3</p>
        </DialogHeader>

        {/* Step 1: Course Details */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Video Editing Masterclass" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Short Description</Label>
              <Input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Brief summary" maxLength={150} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Full Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will students learn?" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 for free" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COURSE_LEVELS.map(lvl => (
                      <SelectItem key={lvl} value={lvl} className="capitalize">{lvl.replace("-", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thumbnail */}
            <div className="space-y-1.5">
              <Label className="text-xs">Thumbnail</Label>
              <div className="flex items-center gap-3">
                {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" className="h-14 w-20 object-cover rounded-md" />}
                <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                <Button type="button" variant="outline" size="sm" onClick={() => thumbnailInputRef.current?.click()} disabled={thumbnailUploading}>
                  <Image className="h-3.5 w-3.5 mr-1.5" />
                  {thumbnailUploading ? "Uploading..." : thumbnailUrl ? "Change" : "Upload"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={goToStep2} disabled={!title.trim()} size="sm" className="gap-1.5">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Lesson Count */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              How many lessons will <span className="font-medium text-foreground">"{title}"</span> have?
            </p>

            <div className="space-y-1.5">
              <Label className="text-xs">Number of Lessons</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={lessonCount}
                onChange={(e) => setLessonCount(parseInt(e.target.value) || 1)}
              />
              <p className="text-[10px] text-muted-foreground">You can add more lessons later from the course editor.</p>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => setStep(1)} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <Button onClick={goToStep3} size="sm" className="gap-1.5">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Lesson Details + Video Uploads */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Upload a video for each lesson to continue.
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {lessons.map((lesson, i) => (
                <div key={i} className="p-3 rounded-lg border border-border bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground w-5 flex-shrink-0">{i + 1}.</span>
                    <Input
                      value={lesson.title}
                      onChange={(e) => updateLessonTitle(i, e.target.value)}
                      placeholder={`Lesson ${i + 1} title`}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 pl-7">
                    {lesson.videoUrl ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">Video uploaded</span>
                        <input
                          ref={el => { videoInputRefs.current[i] = el; }}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleLessonVideoUpload(i, e)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={() => videoInputRefs.current[i]?.click()}
                          disabled={lesson.uploading}
                        >
                          Replace
                        </Button>
                      </div>
                    ) : (
                      <>
                        <input
                          ref={el => { videoInputRefs.current[i] = el; }}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleLessonVideoUpload(i, e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => videoInputRefs.current[i]?.click()}
                          disabled={lesson.uploading}
                        >
                          {lesson.uploading ? (
                            <><Loader2 className="w-3 h-3 animate-spin" /> Uploading...</>
                          ) : (
                            <><Video className="w-3 h-3" /> Upload Video</>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => setStep(2)} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || anyLessonUploading || !allLessonsHaveVideo}
                size="sm"
                className="gap-1.5"
              >
                {submitting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...</>
                ) : (
                  <><Check className="w-3.5 h-3.5" /> Create Course</>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
