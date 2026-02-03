import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCourse } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle,
  BookOpen,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const LearnCourse = () => {
  const { courseId } = useParams();
  const { data: course, isLoading } = useCourse(courseId);
  const sections = course?.sections || [];
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const isMobile = useIsMobile();

  const allLessons = sections.flatMap(section => section.lessons || []);
  const currentLesson = allLessons.find(l => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const progress = allLessons.length > 0 
    ? (completedLessons.length / allLessons.length) * 100 
    : 0;

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1].id);
    }
  };

  const toggleComplete = (lessonId) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <Link to={`/courses/${courseId}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to course
        </Link>
        <h2 className="font-semibold text-foreground mt-2 line-clamp-2">
          {course?.title}
        </h2>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.lessons?.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonId(lesson.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                      currentLesson?.id === lesson.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {completedLessons.includes(lesson.id) ? (
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <Play className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="line-clamp-2">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-80 border-r border-border flex-shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <h2 className="font-semibold text-foreground line-clamp-1 flex-1 text-center">
              {course?.title}
            </h2>
            <div className="w-10" />
          </div>
        )}

        {/* Video Area */}
        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-6">
              {currentLesson?.video_url ? (
                <video
                  src={currentLesson.video_url}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold text-foreground">
                    {currentLesson?.title || "Select a lesson"}
                  </h1>
                  <Button
                    variant={completedLessons.includes(currentLesson?.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => currentLesson && toggleComplete(currentLesson.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {completedLessons.includes(currentLesson?.id) ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
                
                {currentLesson?.description && (
                  <p className="text-muted-foreground">
                    {currentLesson.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {allLessons.length}
              </span>
              <Button
                onClick={handleNext}
                disabled={currentIndex >= allLessons.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;
