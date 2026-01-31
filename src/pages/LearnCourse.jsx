import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Circle, PlayCircle, Lock, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LearnCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !user) return;

      // Check enrollment
      const { data: enrollmentData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .single();

      if (!enrollmentData) {
        navigate(`/courses/${courseId}`);
        return;
      }

      setEnrollment(enrollmentData);

      // Fetch course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      setCourse(courseData);

      // Fetch sections with lessons
      const { data: sectionsData } = await supabase
        .from("course_sections")
        .select(`
          *,
          course_lessons (*)
        `)
        .eq("course_id", courseId)
        .order("sort_order");

      setSections(sectionsData || []);

      // Set first lesson as current if none selected
      if (sectionsData?.[0]?.course_lessons?.[0]) {
        setCurrentLesson(sectionsData[0].course_lessons[0]);
      }

      setLoading(false);
    };

    fetchCourseData();
  }, [courseId, user, navigate]);

  const completedLessons = enrollment?.completed_lessons || [];
  const totalLessons = sections.reduce((acc, s) => acc + (s.course_lessons?.length || 0), 0);
  const progress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  const markLessonComplete = async (lessonId) => {
    if (!enrollment || completedLessons.includes(lessonId)) return;

    const newCompleted = [...completedLessons, lessonId];
    const newProgress = (newCompleted.length / totalLessons) * 100;

    const { error } = await supabase
      .from("enrollments")
      .update({
        completed_lessons: newCompleted,
        progress_percentage: newProgress,
        is_completed: newProgress >= 100,
        completed_at: newProgress >= 100 ? new Date().toISOString() : null,
      })
      .eq("id", enrollment.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
      return;
    }

    setEnrollment({
      ...enrollment,
      completed_lessons: newCompleted,
      progress_percentage: newProgress,
    });

    if (newProgress >= 100) {
      toast({
        title: "Congratulations!",
        description: "You've completed this course!",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!course || !enrollment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="border-b p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/my-learning")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-semibold">{course.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Progress value={progress} className="w-32 h-2" />
                  <span>{Math.round(progress)}% complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r hidden lg:block">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h2 className="font-semibold mb-4">Course Content</h2>
                <Accordion type="multiple" defaultValue={sections.map(s => s.id)}>
                  {sections.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-sm">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {section.course_lessons?.map((lesson) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            const isCurrent = currentLesson?.id === lesson.id;

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setCurrentLesson(lesson)}
                                className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm hover:bg-accent ${
                                  isCurrent ? "bg-accent" : ""
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {currentLesson ? (
              <div className="p-6">
                {/* Video Player */}
                {currentLesson.video_url ? (
                  <div className="aspect-video bg-black rounded-lg mb-6">
                    <video
                      src={currentLesson.video_url}
                      controls
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}

                {/* Lesson Info */}
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                  <p className="text-muted-foreground mb-6">
                    {currentLesson.description}
                  </p>

                  <Button
                    onClick={() => markLessonComplete(currentLesson.id)}
                    disabled={completedLessons.includes(currentLesson.id)}
                  >
                    {completedLessons.includes(currentLesson.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      "Mark as Complete"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Select a lesson to start learning
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnCourse;
