import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useCourse, useCheckEnrollment, useUpdateProgress, CourseSection, CourseLesson } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  PlayCircle, CheckCircle, Lock, ArrowLeft, ChevronLeft, 
  ChevronRight, Loader2, Menu, X, BookOpen
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const LearnCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: enrollment, isLoading: enrollmentLoading } = useCheckEnrollment(courseId);
  const updateProgress = useUpdateProgress();

  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get all lessons in order
  const allLessons = course?.sections?.flatMap(s => s.lessons || []) || [];
  const currentIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;

  // Initialize first lesson
  useEffect(() => {
    if (course?.sections && !currentLesson) {
      const firstSection = course.sections[0];
      if (firstSection?.lessons?.[0]) {
        setCurrentLesson(firstSection.lessons[0]);
      }
    }
  }, [course, currentLesson]);

  // Check access
  useEffect(() => {
    if (!enrollmentLoading && !enrollment && !courseLoading) {
      navigate(`/courses/${courseId}`);
    }
  }, [enrollment, enrollmentLoading, courseLoading, courseId, navigate]);

  const handleLessonClick = (lesson: CourseLesson) => {
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = async () => {
    if (!enrollment || !currentLesson) return;

    const completedLessons = enrollment.completed_lessons || [];
    if (completedLessons.includes(currentLesson.id)) return;

    const newCompletedLessons = [...completedLessons, currentLesson.id];
    const progressPercentage = Math.round((newCompletedLessons.length / allLessons.length) * 100);

    await updateProgress.mutateAsync({
      enrollmentId: enrollment.id,
      lessonId: currentLesson.id,
      completedLessons: newCompletedLessons,
      progressPercentage,
    });
  };

  const goToNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completed_lessons?.includes(lessonId) || false;
  };

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to enroll in this course first.</p>
          <Link to={`/courses/${courseId}`}>
            <Button>View Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to={`/courses/${courseId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <h2 className="font-semibold text-foreground line-clamp-2">{course.title}</h2>
        <div className="mt-3">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{enrollment.progress_percentage}%</span>
          </div>
          <Progress value={enrollment.progress_percentage} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={course.sections?.map(s => s.id)} className="w-full">
          {course.sections?.map((section, sIndex) => (
            <AccordionItem key={section.id} value={section.id} className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <span className="text-sm font-medium text-left">
                  Section {sIndex + 1}: {section.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {section.lessons?.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isCompleted = isLessonCompleted(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive 
                          ? "bg-primary/10 border-l-2 border-primary" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isActive ? "text-primary font-medium" : "text-foreground"}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.duration_minutes} min
                        </p>
                      </div>
                    </button>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block border-r border-border bg-card transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0"}`}>
        {sidebarOpen && <SidebarContent />}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            {/* Desktop Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <span className="text-sm text-muted-foreground hidden sm:inline">
              Lesson {currentIndex + 1} of {allLessons.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevLesson}
              disabled={currentIndex <= 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextLesson}
              disabled={currentIndex >= allLessons.length - 1}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </header>

        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col">
          {currentLesson ? (
            <>
              {/* Video Player */}
              <div className="aspect-video bg-black relative">
                {currentLesson.video_url ? (
                  <video
                    key={currentLesson.id}
                    src={currentLesson.video_url}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No video available for this lesson</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-6 max-w-4xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {currentLesson.title}
                    </h1>
                    <Badge variant="outline">{currentLesson.duration_minutes} min</Badge>
                  </div>

                  <Button
                    onClick={handleMarkComplete}
                    disabled={isLessonCompleted(currentLesson.id) || updateProgress.isPending}
                    className={isLessonCompleted(currentLesson.id) ? "bg-primary/20" : ""}
                  >
                    {isLessonCompleted(currentLesson.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : updateProgress.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>

                {currentLesson.description && (
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>{currentLesson.description}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LearnCourse;
