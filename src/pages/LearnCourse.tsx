import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCourse, useCheckEnrollment, useUpdateProgress, CourseSection, CourseLesson } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  PlayCircle, CheckCircle, Lock, ArrowLeft, ChevronLeft, 
  ChevronRight, Loader2, Menu, X, BookOpen, Home
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LigamLogo from "@/components/LigamLogo";

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
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <LigamLogo className="w-8 h-8" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <Link to={`/courses/${courseId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Course
          </Link>
        </div>
        <h2 className="font-semibold text-foreground line-clamp-2 text-lg">{course.title}</h2>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Your progress</span>
            <span className="font-medium text-primary">{enrollment.progress_percentage}%</span>
          </div>
          <Progress value={enrollment.progress_percentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {enrollment.completed_lessons?.length || 0} of {allLessons.length} lessons completed
          </p>
        </div>
      </div>

      {/* Course Content */}
      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={course.sections?.map(s => s.id)} className="w-full">
          {course.sections?.map((section, sIndex) => (
            <AccordionItem key={section.id} value={section.id} className="border-b-0 border-border">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 text-left">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {sIndex + 1}
                  </span>
                  <span className="text-sm font-medium">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                {section.lessons?.map((lesson, lIndex) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isCompleted = isLessonCompleted(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                        isActive 
                          ? "bg-primary/10 border-l-4 border-primary" 
                          : "hover:bg-muted/50 border-l-4 border-transparent"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted 
                          ? "bg-primary text-primary-foreground" 
                          : isActive 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted text-muted-foreground"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{lIndex + 1}</span>
                        )}
                      </div>
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
      <aside className={`hidden lg:block border-r border-border transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0 overflow-hidden"}`}>
        {sidebarOpen && <SidebarContent />}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card sticky top-0 z-10">
          <div className="flex items-center gap-3">
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

            <div className="hidden sm:block h-6 w-px bg-border" />

            <div className="hidden sm:flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                Lesson {currentIndex + 1} / {allLessons.length}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevLesson}
              disabled={currentIndex <= 0}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextLesson}
              disabled={currentIndex >= allLessons.length - 1}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col w-full">
          {currentLesson ? (
            <>
              {/* Video Player */}
              <div className="w-full aspect-video bg-black relative">
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
                      <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No video available for this lesson</p>
                      <p className="text-sm text-white/60 mt-2">Check the lesson description for resources</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-4 sm:p-6 lg:p-8 w-full">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                        {currentLesson.title}
                      </h1>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-muted-foreground">
                          {currentLesson.duration_minutes} min
                        </Badge>
                        {currentLesson.content_type && (
                          <Badge variant="secondary" className="capitalize">
                            {currentLesson.content_type}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleMarkComplete}
                      disabled={isLessonCompleted(currentLesson.id) || updateProgress.isPending}
                      className={`flex-shrink-0 ${isLessonCompleted(currentLesson.id) ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-primary hover:bg-primary/90"}`}
                      size="lg"
                    >
                      {isLessonCompleted(currentLesson.id) ? (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Completed
                        </>
                      ) : updateProgress.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Mark as Complete
                        </>
                      )}
                    </Button>
                  </div>

                  {currentLesson.description && (
                    <div className="prose prose-sm max-w-none text-muted-foreground bg-muted/30 rounded-lg p-4 sm:p-6">
                      <p>{currentLesson.description}</p>
                    </div>
                  )}

                  {/* Navigation Footer */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                    {currentIndex > 0 && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={goToPrevLesson}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous: {allLessons[currentIndex - 1]?.title}
                      </Button>
                    )}
                    {currentIndex < allLessons.length - 1 && (
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={goToNextLesson}
                      >
                        Next: {allLessons[currentIndex + 1]?.title}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    {currentIndex === allLessons.length - 1 && (
                      <Link to={`/courses/${courseId}`} className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <Award className="w-4 h-4 mr-2" />
                          Complete Course
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
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

// Add missing Award import
import { Award } from "lucide-react";

export default LearnCourse;
