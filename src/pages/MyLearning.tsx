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
  Loader2, Video, ArrowRight 
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
        navigate("/auth");
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            My Learning
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and continue learning
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{enrollments.length}</div>
              <div className="text-sm text-muted-foreground">Enrolled Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{inProgressCourses.length}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{completedCourses.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{upcomingBookings.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming Sessions</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="sessions">Booked Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
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
                {/* In Progress */}
                {inProgressCourses.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Continue Learning</h2>
                    <div className="grid gap-4">
                      {inProgressCourses.map((enrollment) => (
                        <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Not Started */}
                {notStartedCourses.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Start Learning</h2>
                    <div className="grid gap-4">
                      {notStartedCourses.map((enrollment) => (
                        <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed */}
                {completedCourses.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Completed</h2>
                    <div className="grid gap-4">
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
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

const EnrollmentCard = ({ enrollment }: { enrollment: Enrollment }) => {
  const course = enrollment.course;
  if (!course) return null;

  return (
    <Card className="border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-32 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {course.thumbnail_url ? (
              <img 
                src={course.thumbnail_url} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
              {course.title}
            </h3>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{enrollment.progress_percentage}% complete</span>
                {enrollment.is_completed && (
                  <span className="flex items-center gap-1 text-primary">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>
              <Progress value={enrollment.progress_percentage} className="h-1.5" />
            </div>

            <Link to={`/learn/${course.id}`}>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                {enrollment.progress_percentage > 0 ? "Continue" : "Start Learning"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const scheduledDate = new Date(booking.scheduled_at);
  const isPast = scheduledDate < new Date();

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">{booking.title}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{scheduledDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span>{booking.duration_minutes} min</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={
              booking.status === 'confirmed' ? 'default' :
              booking.status === 'cancelled' ? 'destructive' :
              booking.status === 'completed' ? 'secondary' : 'outline'
            } className="capitalize">
              {booking.status}
            </Badge>

            {booking.meeting_url && !isPast && booking.status === 'confirmed' && (
              <Button size="sm" asChild>
                <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer">
                  Join
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
