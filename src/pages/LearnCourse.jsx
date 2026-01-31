import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { CheckCircle, PlayCircle, Lock, ChevronLeft, FileText, Clock } from "lucide-react";
import { Navigate } from "react-router-dom";

const LearnCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { course, sections, enrollment, markLessonComplete, isLoading } = useCourses(courseId);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (sections?.length > 0 && sections[0].lessons?.length > 0 && !activeLesson) {
      setActiveLesson(sections[0].lessons[0]);
    }
  }, [sections, activeLesson]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading course...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!enrollment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Lock className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You need to enroll in this course to access the content.</p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>View Course Details</Button>
        </div>
      </Layout>
    );
  }

  const completedLessons = enrollment.completed_lessons || [];
  const totalLessons = sections?.reduce((sum, section) => sum + (section.lessons?.length || 0), 0) || 0;
  const progressPercent = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  const handleCompleteLesson = async () => {
    if (activeLesson && !completedLessons.includes(activeLesson.id)) {
      await markLessonComplete(activeLesson.id);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(`/courses/${courseId}`)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="font-semibold">{course?.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {completedLessons.length} / {totalLessons} lessons completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Progress value={progressPercent} className="w-32" />
                <span className="text-sm font-medium">{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video/Content Area */}
            <div className="lg:col-span-2 space-y-4">
              {activeLesson ? (
                <>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {activeLesson.video_url ? (
                      <video
                        src={activeLesson.video_url}
                        controls
                        className="w-full h-full"
                        onEnded={handleCompleteLesson}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <FileText className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{activeLesson.title}</CardTitle>
                        {completedLessons.includes(activeLesson.id) ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </Badge>
                        ) : (
                          <Button size="sm" onClick={handleCompleteLesson}>
                            Mark as Complete
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {activeLesson.description || "No description available."}
                      </p>
                      {activeLesson.duration_minutes && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{activeLesson.duration_minutes} minutes</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="aspect-video flex items-center justify-center">
                  <p className="text-muted-foreground">Select a lesson to begin</p>
                </Card>
              )}
            </div>

            {/* Course Content Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <Accordion type="multiple" defaultValue={sections?.map((s) => s.id)} className="px-4 pb-4">
                      {sections?.map((section, sectionIndex) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="text-sm">
                            <div className="flex items-center gap-2">
                              <span>Section {sectionIndex + 1}:</span>
                              <span className="font-medium">{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1">
                              {section.lessons?.map((lesson, lessonIndex) => {
                                const isCompleted = completedLessons.includes(lesson.id);
                                const isActive = activeLesson?.id === lesson.id;

                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm transition-colors ${
                                      isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className={`h-4 w-4 ${isActive ? "" : "text-green-500"}`} />
                                    ) : (
                                      <PlayCircle className="h-4 w-4" />
                                    )}
                                    <span className="flex-1 truncate">
                                      {sectionIndex + 1}.{lessonIndex + 1} {lesson.title}
                                    </span>
                                    {lesson.duration_minutes && (
                                      <span className="text-xs opacity-70">
                                        {lesson.duration_minutes}m
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LearnCourse;
