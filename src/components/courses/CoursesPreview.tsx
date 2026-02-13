import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";

const CoursesPreview = () => {
  const { data: courses = [], isLoading } = useFeaturedCourses();
  const featured = courses.slice(0, 4);

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-foreground">Learn</h2>
          <Link to="/courses">
            <Button variant="ghost" size="sm">View All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-3 animate-pulse">
                <div className="aspect-video bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featured.map((c) => (
              <Link key={c.id} to={`/courses/${c.id}`} className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                <div className="aspect-video rounded overflow-hidden mb-2 bg-muted">
                  {c.thumbnail_url ? (
                    <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-muted-foreground" /></div>
                  )}
                </div>
                <p className="text-xs font-medium text-foreground line-clamp-1">{c.title}</p>
                <p className="text-xs text-primary font-bold mt-0.5">{c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card border border-border rounded-lg">
            <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
            <p className="text-muted-foreground text-xs">No courses yet</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesPreview;
