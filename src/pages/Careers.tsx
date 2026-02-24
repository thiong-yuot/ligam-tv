import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Briefcase, Loader2 } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";

const Careers = () => {
  const { data: jobs = [], isLoading } = useJobs();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-display font-bold text-foreground mb-1">Careers</h1>
          <p className="text-xs text-muted-foreground mb-6">Help us build the future of live streaming.</p>

          <section className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Why Join Us</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { title: "Remote First", desc: "Work from anywhere" },
                { title: "Health & Wellness", desc: "Comprehensive coverage" },
                { title: "Equity", desc: "Own what you build" },
                { title: "Team Events", desc: "Regular retreats" },
              ].map((b) => (
                <div key={b.title} className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-xs font-medium text-foreground">{b.title}</p>
                  <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Open Positions</h2>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-1.5">
                {jobs.map((job) => (
                  <div key={job.id} className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-foreground">{job.title}</p>
                      <Badge variant="secondary" className="text-[10px] h-5">{job.department}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{job.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No open positions right now</p>
              </div>
            )}
          </section>

          <div className="text-center mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Don't see your role?</p>
            <a href="mailto:careers@ligam.tv" className="text-xs text-primary hover:underline font-medium">Send a general application</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
