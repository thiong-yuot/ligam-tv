import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCourse, useCourseReviews, useCheckEnrollment, useEnrollCourse } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, Clock, Users, BookOpen, PlayCircle, CheckCircle, 
  Lock, Video, FileText, Loader2, ArrowLeft, Calendar 
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: reviews = [] } = useCourseReviews(courseId);
  const { data: enrollment } = useCheckEnrollment(courseId);
  const enrollMutation = useEnrollCourse();

  const handleEnroll = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (course?.price === 0) {
      await enrollMutation.mutateAsync({ courseId: courseId!, amountPaid: 0 });
      navigate(`/learn/${courseId}`);
    } else {
      // TODO: Implement Stripe checkout for paid courses
      await enrollMutation.mutateAsync({ courseId: courseId!, amountPaid: course?.price || 0 });
      navigate(`/learn/${courseId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">This course doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.sections?.reduce((sum, s) => sum + (s.lessons?.length || 0), 0) || 0;
  const totalDuration = course.sections?.reduce(
    (sum, s) => sum + (s.lessons?.reduce((lSum, l) => lSum + l.duration_minutes, 0) || 0), 
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                {course.category && (
                  <Badge variant="secondary">{course.category}</Badge>
                )}
                <Badge variant="outline" className="capitalize">{course.level}</Badge>
                {course.is_featured && (
                  <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {course.title}
              </h1>

              {course.short_description && (
                <p className="text-lg text-muted-foreground">
                  {course.short_description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{course.average_rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{course.total_enrollments} students</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{totalDuration} min total</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <PlayCircle className="w-4 h-4" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-card border-border">
                {course.thumbnail_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div className="text-3xl font-bold text-foreground">
                    {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                  </div>

                  {enrollment ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Enrolled</span>
                      </div>
                      <Progress value={enrollment.progress_percentage} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {enrollment.progress_percentage}% complete
                      </p>
                      <Link to={`/learn/${course.id}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enrolling...
                        </>
                      ) : course.price === 0 ? (
                        "Enroll for Free"
                      ) : (
                        `Enroll Now - $${course.price}`
                      )}
                    </Button>
                  )}

                  <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Access on mobile and desktop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="curriculum" className="space-y-8">
          <TabsList>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Course Content
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.sections?.length || 0} sections • {totalLessons} lessons • {totalDuration} min total
                </p>
              </CardHeader>
              <CardContent>
                {course.sections && course.sections.length > 0 ? (
                  <Accordion type="multiple" className="w-full">
                    {course.sections.map((section, index) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-muted-foreground text-sm">
                              Section {index + 1}
                            </span>
                            <span className="font-medium">{section.title}</span>
                            <Badge variant="outline" className="ml-auto mr-4">
                              {section.lessons?.length || 0} lessons
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {section.lessons?.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                              >
                                {lesson.is_preview || enrollment ? (
                                  <PlayCircle className="w-4 h-4 text-primary" />
                                ) : (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className="flex-1">{lesson.title}</span>
                                {lesson.is_preview && !enrollment && (
                                  <Badge variant="secondary" className="text-xs">Preview</Badge>
                                )}
                                <span className="text-sm text-muted-foreground">
                                  {lesson.duration_minutes} min
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No content added yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {course.description || "No description provided."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {["Master the fundamentals", "Build real projects", "Get hands-on experience", "Learn best practices"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to review this course after enrolling!
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.review_text}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
