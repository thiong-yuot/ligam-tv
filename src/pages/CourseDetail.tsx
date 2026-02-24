import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCourse, useCourseReviews, useCheckEnrollment, useEnrollCourse, useCourses, useCreateReview } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { useCourseCheckout } from "@/hooks/useStripeCheckout";
import { useCreatorProfile } from "@/hooks/useCreatorProfile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InstructorCard from "@/components/courses/InstructorCard";
import { 
  Star, Clock, Users, BookOpen, PlayCircle, CheckCircle, 
  Lock, Video, FileText, Loader2, ArrowLeft, Calendar,
  Globe, Award, Shield, Smartphone, Download
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourse(courseId);
  const { data: reviews = [] } = useCourseReviews(courseId);
  const { data: enrollment } = useCheckEnrollment(courseId);
  const { data: allCourses } = useCourses();
  const { data: creatorProfile, isLoading: creatorLoading } = useCreatorProfile(course?.creator_id);
  const enrollMutation = useEnrollCourse();
  const { checkout, loading: checkoutLoading } = useCourseCheckout();
  const createReview = useCreateReview();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const userAlreadyReviewed = reviews.some(r => r.user_id === user?.id);

  const handleSubmitReview = async () => {
    if (!courseId || !user) return;
    await createReview.mutateAsync({
      course_id: courseId,
      rating: reviewRating,
      review_text: reviewText.trim() || undefined,
    });
    setReviewText("");
    setReviewRating(5);
  };

  // Count courses by the same creator
  const creatorCourseCount = allCourses?.filter(c => c.creator_id === course?.creator_id).length || 0;

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (course?.price === 0) {
      // Free course - enroll directly
      await enrollMutation.mutateAsync({ courseId: courseId!, amountPaid: 0 });
      navigate(`/learn/${courseId}`);
    } else {
      // Paid course - use Stripe checkout
      await checkout(courseId!);
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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 text-center">
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

  const benefits = [
    { icon: Globe, text: "Full lifetime access" },
    { icon: Smartphone, text: "Access on mobile and desktop" },
    { icon: Download, text: "Downloadable resources" },
    { icon: Award, text: "Certificate of completion" },
    { icon: Shield, text: "30-day money-back guarantee" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap gap-2">
                  {course.category && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {course.category}
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">{course.level}</Badge>
                  {course.is_featured && (
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {course.title}
                </h1>

                {course.short_description && (
                  <p className="text-lg md:text-xl text-muted-foreground">
                    {course.short_description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(course.average_rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{course.average_rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({course.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course.total_enrollments} students enrolled</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.sections?.length || 0} sections</span>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 bg-card border-border overflow-hidden">
                  {course.thumbnail_url && (
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground">
                        {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                      </span>
                      {course.price > 0 && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${(course.price * 1.5).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {enrollment ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">You're enrolled!</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{enrollment.progress_percentage}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                        </div>
                        <Link to={`/learn/${course.id}`} className="block">
                          <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        size="lg"
                        onClick={handleEnroll}
                        disabled={enrollMutation.isPending || checkoutLoading}
                      >
                        {enrollMutation.isPending || checkoutLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {checkoutLoading ? "Redirecting to checkout..." : "Enrolling..."}
                          </>
                        ) : course.price === 0 ? (
                          "Enroll for Free"
                        ) : (
                          `Enroll Now - $${course.price}`
                        )}
                      </Button>
                    )}

                    <div className="space-y-3 pt-4 border-t border-border">
                      <p className="font-medium text-foreground">This course includes:</p>
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <benefit.icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{benefit.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="curriculum" className="space-y-8">
                  <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="curriculum" className="data-[state=active]:bg-background">
                      Curriculum
                    </TabsTrigger>
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-background">
                      Reviews ({reviews.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="curriculum" className="space-y-4">
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Course Content
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {course.sections?.length || 0} sections • {totalLessons} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                        </p>
                      </CardHeader>
                      <CardContent>
                        {course.sections && course.sections.length > 0 ? (
                          <Accordion type="multiple" className="w-full">
                            {course.sections.map((section, index) => (
                              <AccordionItem key={section.id} value={section.id} className="border-border">
                                <AccordionTrigger className="hover:no-underline py-4">
                                  <div className="flex items-center gap-3 text-left flex-1">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                                      {index + 1}
                                    </span>
                                    <div className="flex-1">
                                      <span className="font-medium block">{section.title}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {section.lessons?.length || 0} lessons
                                      </span>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-1 pl-11">
                                    {section.lessons?.map((lesson) => (
                                      <div
                                        key={lesson.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                      >
                                        {lesson.is_preview || enrollment ? (
                                          <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                        ) : (
                                          <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        )}
                                        <span className="flex-1 text-sm">{lesson.title}</span>
                                        {lesson.is_preview && !enrollment && (
                                          <Badge variant="secondary" className="text-xs">Preview</Badge>
                                        )}
                                        <span className="text-xs text-muted-foreground">
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
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle>About this course</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none text-muted-foreground">
                          {course.description || "No description provided."}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle>What you'll learn</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {["Master the fundamentals", "Build real projects", "Get hands-on experience", "Learn best practices", "Industry-ready skills", "Expert guidance"].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-4">
                    {/* Review Form - only for enrolled users who haven't reviewed */}
                    {enrollment && !userAlreadyReviewed && (
                      <Card className="bg-card border-border">
                        <CardContent className="p-6 space-y-4">
                          <h3 className="font-semibold text-foreground">Write a Review</h3>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setReviewRating(star)}
                                className="p-0.5"
                              >
                                <Star
                                  className={`w-6 h-6 cursor-pointer transition-colors ${
                                    star <= (hoverRating || reviewRating)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              {reviewRating}/5
                            </span>
                          </div>
                          <Textarea
                            placeholder="Share your experience with this course..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={3}
                            className="resize-none"
                          />
                          <Button
                            onClick={handleSubmitReview}
                            disabled={createReview.isPending}
                            size="sm"
                          >
                            {createReview.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Review"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {reviews.length === 0 && (!enrollment || userAlreadyReviewed) ? (
                      <Card className="bg-card border-border">
                        <CardContent className="py-12 text-center">
                          <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="font-semibold text-foreground mb-2">No reviews yet</h3>
                          <p className="text-muted-foreground">
                            {enrollment ? "Thanks for your review!" : "Enroll to be the first to review this course!"}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      reviews.map((review) => (
                        <Card key={review.id} className="bg-card border-border">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  U
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
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
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                {review.review_text && (
                                  <p className="text-foreground">{review.review_text}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>

                {/* Mobile Instructor Card - Visible only on mobile */}
                <div className="lg:hidden mt-8">
                  <InstructorCard 
                    creator={creatorProfile} 
                    isLoading={creatorLoading}
                    totalStudents={course.total_enrollments}
                    totalCourses={creatorCourseCount}
                  />
                </div>
              </div>

              {/* Sidebar - Instructor Info */}
              <div className="hidden lg:block space-y-6">
                <InstructorCard 
                  creator={creatorProfile} 
                  isLoading={creatorLoading}
                  totalStudents={course.total_enrollments}
                  totalCourses={creatorCourseCount}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetail;
