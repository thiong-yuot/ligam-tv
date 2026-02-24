import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, Loader2 } from "lucide-react";
import { usePressReleases } from "@/hooks/usePress";

const Press = () => {
  const { data: pressReleases, isLoading } = usePressReleases();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Press & Media</h1>
          <p className="text-xs text-muted-foreground mb-6">News, updates, and resources for media coverage.</p>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Latest News</h2>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : pressReleases && pressReleases.length > 0 ? (
              <div className="space-y-1.5">
                {pressReleases.map((release) => (
                  <div key={release.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-medium text-foreground">{release.title}</p>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                        {new Date(release.published_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {release.summary && <p className="text-[10px] text-muted-foreground line-clamp-1">{release.summary}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Newspaper className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No press releases yet</p>
              </div>
            )}
          </section>

          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Media inquiries</p>
            <a href="mailto:press@ligam.tv" className="text-xs text-primary hover:underline font-medium">press@ligam.tv</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
