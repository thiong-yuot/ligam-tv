import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { useFeaturedCourses } from "@/hooks/useCourses";

interface CoursesPreviewProps {
  compact?: boolean;
}

const CoursesPreview = ({ compact }: CoursesPreviewProps) => {
  const { data: courses = [], isLoading } = useFeaturedCourses();
  const featured = courses.slice(0, 2);

  const content = (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-display font-bold text-foreground">Learn</h2>
        <Link to="/courses">
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-2 animate-pulse">
              <div className="aspect-video bg-muted rounded mb-1.5" />
              <div className="h-2.5 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : featured.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {featured.map((c) => (
            <Link key={c.id} to={`/courses/${(c as any).slug || c.id}`} className="bg-card border border-border rounded-lg p-2 hover:border-muted-foreground/30 transition-colors">
              <div className="aspect-[4/3] rounded overflow-hidden mb-1.5 bg-muted">
                {c.thumbnail_url ? (
                  <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-muted-foreground" /></div>
                )}
              </div>
              <p className="text-[11px] font-medium text-foreground line-clamp-1">{c.title}</p>
              <p className="text-[11px] text-primary font-bold">{c.price === 0 ? "Free" : `$${c.price.toFixed(2)}`}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-card border border-border rounded-lg">
          <GraduationCap className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
          <p className="text-muted-foreground text-xs">No courses yet</p>
        </div>
      )}
    </>
  );

  if (compact) return <div>{content}</div>;

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto">{content}</div>
    </section>
  );
};

export default CoursesPreview;
