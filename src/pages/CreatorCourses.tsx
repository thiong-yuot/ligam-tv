import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useCreatorCourses, useUpdateCourse, useDeleteCourse, Course } from "@/hooks/useCourses";
import { useSubscription } from "@/hooks/useSubscription";
import AddCourseDialog from "@/components/courses/AddCourseDialog";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Plus, Eye, EyeOff, Users, Star, Loader2, 
  AlertTriangle, Crown, Video, Trash2, Edit, BarChart3,
  GraduationCap
} from "lucide-react";

const CreatorCourses = () => {
  const navigate = useNavigate();
  const { loading: authLoading } = useAuth();
  const { data: courses = [], isLoading } = useCreatorCourses();
  const { tier } = useSubscription();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const [checking, setChecking] = useState(true);

  const courseLimits = { free: 1, creator: 3, pro: Infinity };
  const currentTier = tier || 'free';
  const courseLimit = courseLimits[currentTier as keyof typeof courseLimits] || 1;
  const coursesUsed = courses.length;
  const canAddCourse = coursesUsed < courseLimit;
  const usagePercentage = courseLimit === Infinity ? 0 : (coursesUsed / courseLimit) * 100;

  const totalEnrollments = courses.reduce((acc, c) => acc + (c.total_enrollments || 0), 0);
  const avgRating = courses.length > 0 
    ? courses.reduce((acc, c) => acc + c.average_rating, 0) / courses.length 
    : 0;

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate("/auth");
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

  const handleTogglePublish = async (course: Course) => {
    await updateCourse.mutateAsync({ id: course.id, is_published: !course.is_published });
  };

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      await deleteCourse.mutateAsync(courseId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    My Courses
                  </h1>
                  <p className="text-muted-foreground">
                    Create and manage your educational content
                  </p>
                </div>
              </div>
              <AddCourseDialog disabled={!canAddCourse}>
                <Button 
                  disabled={!canAddCourse} 
                  className="bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Course
                </Button>
              </AddCourseDialog>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{courses.length}</div>
                  <div className="text-sm text-muted-foreground">Total Courses</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{totalEnrollments}</div>
                  <div className="text-sm text-muted-foreground">Total Students</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{avgRating.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">{courses.filter(c => c.is_published).length}</div>
                  <div className="text-sm text-muted-foreground">Published</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <main className="py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Courses Info */}
            <Card className="mb-8 border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-foreground text-lg">Your Courses</span>
                  <Badge variant="outline">Free — Unlimited</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {coursesUsed} course{coursesUsed !== 1 ? "s" : ""} created — no limits, create as many as you want.
                </p>
              </CardContent>
            </Card>

            {/* Courses Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : courses.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="py-20 text-center">
                  <BookOpen className="w-20 h-20 mx-auto text-muted-foreground mb-6" />
                  <h3 className="text-2xl font-semibold text-foreground mb-3">No courses yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Share your knowledge with the world. Create your first course and start earning from your expertise.
                  </p>
                  <AddCourseDialog>
                    <Button className="bg-primary hover:bg-primary/90" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Course
                    </Button>
                  </AddCourseDialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Card key={course.id} className="border-border hover:border-primary/30 transition-all overflow-hidden group">
                    <div className="aspect-video relative overflow-hidden">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Video className="w-12 h-12 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.short_description || "No description added"}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.total_enrollments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{course.average_rating.toFixed(1)}</span>
                        </div>
                        <Badge variant="outline" className="capitalize ml-auto">
                          {course.level}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleTogglePublish(course)}
                          disabled={updateCourse.isPending}
                          className="flex-1"
                        >
                          {course.is_published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Publish
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(course.id)}
                          disabled={deleteCourse.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatorCourses;
