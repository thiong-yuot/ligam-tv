import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useUserEnrollments, Enrollment } from "@/hooks/useCourses";
import { useUserBookings, Booking } from "@/hooks/useBookings";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, PlayCircle, Calendar, Clock, Star, CheckCircle, 
  Loader2, Video, ArrowRight, GraduationCap, Trophy, Target
} from "lucide-react";

const MyLearning = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useUserEnrollments();
  const { data: bookings = [], isLoading: bookingsLoading } = useUserBookings();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login?redirect=%2Fmy-learning");
      }
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const inProgressCourses = enrollments.filter(e => !e.is_completed && e.progress_percentage > 0);
  const completedCourses = enrollments.filter(e => e.is_completed);
  const notStartedCourses = enrollments.filter(e => e.progress_percentage === 0);
  const upcomingBookings = bookings.filter(b => 
    new Date(b.scheduled_at) > new Date() && b.status !== 'cancelled'
  );

  const totalProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress_percentage, 0) / enrollments.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  My Learning
                </h1>
                <p className="text-muted-foreground">
                  Track your progress and continue learning
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{enrollments.length}</div>
                  <div className="text-sm text-muted-foreground">Enrolled Courses</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{inProgressCourses.length}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{completedCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{upcomingBookings.length}</div>
                  <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <main className="py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="courses" className="space-y-6">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="courses" className="data-[state=active]:bg-background">
                  My Courses
                </TabsTrigger>
                <TabsTrigger value="sessions" className="data-[state=active]:bg-background">
                  Booked Sessions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-8">
                {enrollmentsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : enrollments.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="py-16 text-center">
                      <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start learning by enrolling in a course
                      </p>
                      <Link to="/courses">
                        <Button className="bg-primary hover:bg-primary/90">
                          Browse Courses
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Continue Learning */}
                    {inProgressCourses.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <PlayCircle className="w-5 h-5 text-primary" />
                          Continue Learning
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {inProgressCourses.map((enrollment) => (
                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Start Learning */}
                    {notStartedCourses.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Start Learning
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {notStartedCourses.map((enrollment) => (
                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completed */}
                    {completedCourses.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          Completed
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {completedCourses.map((enrollment) => (
                            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="sessions" className="space-y-6">
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : bookings.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="py-16 text-center">
                      <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No sessions booked</h3>
                      <p className="text-muted-foreground mb-6">
                        Book a 1-on-1 session with a creator
                      </p>
                      <Link to="/courses">
                        <Button className="bg-primary hover:bg-primary/90">
                          Find a Tutor
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const EnrollmentCard = ({ enrollment }: { enrollment: Enrollment }) => {
  const course = enrollment.course;
  if (!course) return null;

  return (
    <Card className="border-border hover:border-primary/30 transition-all overflow-hidden group">
      <div className="aspect-video relative overflow-hidden">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Video className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        {enrollment.is_completed && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1 mb-3 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-primary">{enrollment.progress_percentage}%</span>
          </div>
          <Progress value={enrollment.progress_percentage} className="h-2" />
        </div>

        <Link to={`/learn/${course.id}`} className="block">
          <Button className="w-full bg-primary hover:bg-primary/90">
            {enrollment.progress_percentage > 0 ? (
              <>
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Start Learning
                <PlayCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const scheduledDate = new Date(booking.scheduled_at);
  const isPast = scheduledDate < new Date();

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-2">{booking.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{scheduledDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span className="text-foreground">{booking.duration_minutes} min</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={
              booking.status === 'confirmed' ? 'default' :
              booking.status === 'cancelled' ? 'destructive' :
              booking.status === 'completed' ? 'secondary' : 'outline'
            } className="capitalize">
              {booking.status}
            </Badge>

            {booking.meeting_url && !isPast && booking.status === 'confirmed' && (
              <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer">
                  Join Session
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyLearning;
