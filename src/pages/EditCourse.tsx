import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  Upload,
  Loader2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  useCourse,
  useUpdateCourse,
  useCreateSection,
  useCreateLesson,
  CourseSection,
  CourseLesson,
} from "@/hooks/useCourses";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: course, isLoading } = useCourse(courseId);
  const updateCourse = useUpdateCourse();
  const createSection = useCreateSection();
  const createLesson = useCreateLesson();
  const { uploadFile, uploading } = useFileUpload();

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !courseId) return;
    const sections = (course as any)?.sections || [];
    await createSection.mutateAsync({
      course_id: courseId,
      title: newSectionTitle.trim(),
      sort_order: sections.length,
    });
    setNewSectionTitle("");
  };

  const handleAddLesson = async (sectionId: string) => {
    if (!lessonTitle.trim()) return;
    const section = (course as any)?.sections?.find((s: CourseSection) => s.id === sectionId);
    const lessonCount = section?.lessons?.length || 0;
    await createLesson.mutateAsync({
      section_id: sectionId,
      title: lessonTitle.trim(),
      description: lessonDescription.trim() || undefined,
      sort_order: lessonCount,
    });
    setLessonTitle("");
    setLessonDescription("");
    setAddingLessonTo(null);
    // Expand the section to show the new lesson
    setExpandedSections((prev) => new Set(prev).add(sectionId));
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    lessonId: string,
    sectionId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingLessonId(lessonId);
    try {
      const url = await uploadFile(file, "course-content", user.id);
      if (url) {
        const { error } = await supabase
          .from("course_lessons")
          .update({ video_url: url })
          .eq("id", lessonId);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        toast.success("Video uploaded");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingLessonId(null);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section and all its lessons?")) return;
    // Delete lessons first, then section
    const { error: lessonsErr } = await supabase
      .from("course_lessons")
      .delete()
      .eq("section_id", sectionId);
    if (lessonsErr) { toast.error(lessonsErr.message); return; }
    const { error } = await supabase
      .from("course_sections")
      .delete()
      .eq("id", sectionId);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    toast.success("Section deleted");
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    const { error } = await supabase
      .from("course_lessons")
      .delete()
      .eq("id", lessonId);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    toast.success("Lesson deleted");
  };

  const handleTogglePreview = async (lesson: CourseLesson) => {
    const { error } = await supabase
      .from("course_lessons")
      .update({ is_preview: !lesson.is_preview })
      .eq("id", lesson.id);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ["course", courseId] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  const sections: CourseSection[] = (course as any).sections || [];
  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">{course.title}</h1>
              <p className="text-xs text-muted-foreground">
                {sections.length} section{sections.length !== 1 ? "s" : ""} · {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="rounded-lg border border-border overflow-hidden">
                {/* Section header */}
                <button
                  type="button"
                  className="w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => toggleSection(section.id)}
                >
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="text-sm font-medium text-foreground flex-1 truncate">
                    {sIdx + 1}. {section.title}
                  </span>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {section.lessons?.length || 0} lessons
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </button>

                {/* Lessons */}
                {expandedSections.has(section.id) && (
                  <div className="border-t border-border">
                    {section.lessons && section.lessons.length > 0 ? (
                      <div className="divide-y divide-border">
                        {section.lessons.map((lesson, lIdx) => (
                          <div key={lesson.id} className="p-3 pl-10 flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">
                                {sIdx + 1}.{lIdx + 1} {lesson.title}
                              </p>
                              {lesson.video_url ? (
                                <p className="text-xs text-primary">✓ Video attached</p>
                              ) : (
                                <p className="text-xs text-muted-foreground">No video</p>
                              )}
                            </div>
                            {lesson.is_preview && (
                              <Badge variant="outline" className="text-xs shrink-0">Preview</Badge>
                            )}
                            {/* Upload video */}
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              id={`video-${lesson.id}`}
                              onChange={(e) => handleVideoUpload(e, lesson.id, section.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              disabled={uploadingLessonId === lesson.id}
                              onClick={() =>
                                document.getElementById(`video-${lesson.id}`)?.click()
                              }
                            >
                              {uploadingLessonId === lesson.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Video className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() => handleTogglePreview(lesson)}
                              title={lesson.is_preview ? "Remove preview" : "Set as preview"}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-3 pl-10 text-xs text-muted-foreground">No lessons yet</p>
                    )}

                    {/* Add lesson form */}
                    {addingLessonTo === section.id ? (
                      <div className="p-3 pl-10 border-t border-border space-y-2">
                        <Input
                          placeholder="Lesson title"
                          value={lessonTitle}
                          onChange={(e) => setLessonTitle(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Input
                          placeholder="Description (optional)"
                          value={lessonDescription}
                          onChange={(e) => setLessonDescription(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleAddLesson(section.id)}
                            disabled={!lessonTitle.trim() || createLesson.isPending}
                          >
                            {createLesson.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => { setAddingLessonTo(null); setLessonTitle(""); setLessonDescription(""); }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="w-full p-2 pl-10 text-xs text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors border-t border-border flex items-center gap-1"
                        onClick={() => { setAddingLessonTo(section.id); setLessonTitle(""); setLessonDescription(""); }}
                      >
                        <Plus className="w-3 h-3" />
                        Add Lesson
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Section */}
          <div className="flex gap-2">
            <Input
              placeholder="New section title..."
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="h-9 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
            />
            <Button
              size="sm"
              className="h-9 shrink-0"
              onClick={handleAddSection}
              disabled={!newSectionTitle.trim() || createSection.isPending}
            >
              {createSection.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Section
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EditCourse;
