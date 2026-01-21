import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, ArrowRight, GraduationCap, Award, Users } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";

const CoursesPreview = () => {
  const { data: courses = [], isLoading } = useFeaturedCourses();
  const featuredCourses = courses.slice(0, 2);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/creator/courses");
    }
  };
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-card/30">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Skills Academy</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Learn New Skills
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Master new skills with courses from expert creators. From coding to design, 
              unlock your potential with hands-on learning.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span>Expert-led video courses</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <span>Certificates upon completion</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span>1-on-1 tutoring sessions available</span>
              </li>
            </ul>

            <div className="flex gap-4 pt-4">
              <Link to="/courses">
                <Button size="lg" className="group">
                  Browse Courses
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={handleCreateCourse}>
                Create a Course
              </Button>
            </div>
          </div>

          {/* Right - Courses Grid */}
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg mb-3" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-amber-500/20">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {course.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">
                        {course.average_rating?.toFixed(1) || "New"}
                      </span>
                    </div>
                    <span className="text-primary font-bold text-sm">
                      {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 bg-card border border-border rounded-xl">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No courses available yet</p>
                <Button variant="outline" size="sm" onClick={handleCreateCourse}>
                  Create the First Course
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
