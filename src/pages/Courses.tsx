import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/courses/CourseCard";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Loader2, GraduationCap } from "lucide-react";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses = [], isLoading } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    return courses.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-16 pb-4 px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          <h1 className="text-lg font-display font-bold text-foreground">Learn</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-card"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => user ? navigate("/creator/courses") : navigate("/login")}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              Teach
            </Button>
          </div>
        </div>
      </section>

      <main className="px-4 md:px-6 lg:px-8 pb-12">
        <div className="w-full max-w-[1920px] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No courses found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
