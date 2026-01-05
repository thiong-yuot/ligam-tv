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
import { BookOpen, Plus, Eye, EyeOff, Users, Star, Loader2, AlertTriangle, Crown, Video, Trash2 } from "lucide-react";

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) navigate("/auth");
      setChecking(false);
    };
    checkAuth();
  }, [navigate]);

  if (authLoading || checking) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const handleTogglePublish = async (course: Course) => {
    await updateCourse.mutateAsync({ id: course.id, is_published: !course.is_published });
  };

  const handleDelete = async (courseId: string) => {
    if (confirm("Delete this course?")) await deleteCourse.mutateAsync(courseId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><BookOpen className="w-8 h-8 text-primary" />My Courses</h1>
            <p className="text-muted-foreground mt-1">Create and manage your educational content</p>
          </div>
          <AddCourseDialog disabled={!canAddCourse}><Button disabled={!canAddCourse} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />Create Course</Button></AddCourseDialog>
        </div>

        <Card className="mb-8 border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className="font-semibold text-foreground">Course Limit</span><Badge variant="outline" className="capitalize">{currentTier} Plan</Badge></div>
                <Progress value={usagePercentage} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">{coursesUsed} of {courseLimit === Infinity ? "unlimited" : courseLimit} courses used</p>
              </div>
              {!canAddCourse && <div className="flex items-center gap-4"><div className="flex items-center gap-2 text-amber-500"><AlertTriangle className="w-5 h-5" /><span className="text-sm font-medium">Limit reached</span></div><Button variant="outline" onClick={() => navigate("/pricing")} className="gap-2"><Crown className="w-4 h-4" />Upgrade</Button></div>}
            </div>
            <div className="mt-4 pt-4 border-t border-border"><p className="text-sm text-muted-foreground"><strong>Free:</strong> 1 course | <strong>Creator:</strong> 3 courses | <strong>Pro:</strong> Unlimited</p></div>
          </CardContent>
        </Card>

        {isLoading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : courses.length === 0 ? (
          <Card className="border-dashed border-2"><CardContent className="py-16 text-center"><BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3><p className="text-muted-foreground mb-6">Create your first course</p><AddCourseDialog><Button className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />Create Course</Button></AddCourseDialog></CardContent></Card>
        ) : (
          <div className="grid gap-6">{courses.map((course) => (
            <Card key={course.id} className="border-border hover:border-primary/30 transition-colors"><CardContent className="p-6"><div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-48 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">{course.thumbnail_url ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Video className="w-8 h-8 text-muted-foreground" /></div>}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3"><div><h3 className="text-lg font-semibold text-foreground line-clamp-1">{course.title}</h3><div className="flex items-center gap-2 mt-1"><Badge variant={course.is_published ? "default" : "secondary"}>{course.is_published ? "Published" : "Draft"}</Badge><Badge variant="outline" className="capitalize">{course.level}</Badge></div></div><div className="text-xl font-bold text-foreground">{course.price === 0 ? "Free" : `$${course.price}`}</div></div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.short_description || "No description"}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4"><div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>{course.total_enrollments} students</span></div><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span>{course.average_rating.toFixed(1)}</span></div></div>
                <div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="sm" onClick={() => handleTogglePublish(course)} disabled={updateCourse.isPending}>{course.is_published ? <><EyeOff className="w-4 h-4 mr-1"/>Unpublish</> : <><Eye className="w-4 h-4 mr-1"/>Publish</>}</Button><Button variant="outline" size="sm" onClick={() => navigate(`/courses/${course.id}`)}><Eye className="w-4 h-4 mr-1"/>Preview</Button><Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(course.id)} disabled={deleteCourse.isPending}><Trash2 className="w-4 h-4 mr-1"/>Delete</Button></div>
              </div>
            </div></CardContent></Card>
          ))}</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CreatorCourses;
