import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Clock, CheckCircle, PlayCircle } from "lucide-react";

const MyLearning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          courses (*)
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });

      if (error) {
        console.error("Error fetching enrollments:", error);
      } else {
        setEnrollments(data || []);
      }
      setLoading(false);
    };

    fetchEnrollments();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view your courses</h1>
          <p className="text-muted-foreground mb-6">
            Track your learning progress and continue where you left off
          </p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  const inProgress = enrollments.filter(e => !e.is_completed);
  const completed = enrollments.filter(e => e.is_completed);

  const CourseCard = ({ enrollment }) => {
    const course = enrollment.courses;
    if (!course) return null;

    return (
      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {enrollment.is_completed && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <span className="font-semibold">Completed</span>
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4" />
            <span>{course.total_duration_minutes || 0} min</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(enrollment.progress_percentage || 0)}%</span>
            </div>
            <Progress value={enrollment.progress_percentage || 0} />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => navigate(`/learn/${course.id}`)}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            {enrollment.is_completed ? "Review Course" : "Continue Learning"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Learning</h1>
          <p className="text-muted-foreground">
            Track your progress and continue where you left off
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
            <p className="text-muted-foreground mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
          </div>
        ) : (
          <Tabs defaultValue="in-progress">
            <TabsList className="mb-6">
              <TabsTrigger value="in-progress">
                In Progress ({inProgress.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completed.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="in-progress">
              {inProgress.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No courses in progress</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {inProgress.map((enrollment) => (
                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completed.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No completed courses yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {completed.map((enrollment) => (
                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default MyLearning;
