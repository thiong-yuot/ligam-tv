import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCourse, useCourseSections } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  CheckCircle,
  BookOpen,
  Award
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: sections = [] } = useCourseSections(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Course not found
            </h1>
            <Link to="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Handle enrollment logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  {course.category && (
                    <Badge variant="secondary">{course.category}</Badge>
                  )}
                  {course.level && (
                    <Badge variant="outline">{course.level}</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                  {course.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {course.description || course.short_description}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {course.average_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{course.average_rating}</span>
                    <span>({course.total_reviews || 0} reviews)</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.total_enrollments || 0} students</span>
                </div>
                {course.total_duration_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.round(course.total_duration_minutes / 60)} hours</span>
                  </div>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {sections.length > 0 ? (
                    <Accordion type="single" collapsible>
                      {sections.map((section) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger>
                            {section.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {section.lessons?.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                                >
                                  <Play className="h-4 w-4 text-muted-foreground" />
                                  <span className="flex-1">{lesson.title}</span>
                                  {lesson.duration_minutes && (
                                    <span className="text-sm text-muted-foreground">
                                      {lesson.duration_minutes} min
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No content available yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-foreground mb-4">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </div>
                  
                  <Button className="w-full mb-4" size="lg" onClick={handleEnroll}>
                    {course.price === 0 ? "Enroll for Free" : "Buy Now"}
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{course.total_lessons || 0} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
