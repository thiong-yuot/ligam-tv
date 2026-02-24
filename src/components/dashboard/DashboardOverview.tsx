import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Eye } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  total_views?: number;
  created_at?: string;
  [key: string]: any;
}

interface DashboardOverviewProps {
  userStreams: Stream[];
}

const DashboardOverview = ({ userStreams }: DashboardOverviewProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Recent Streams</p>
        <Link to="/analytics" className="text-xs text-primary hover:underline">View all</Link>
      </div>
      {userStreams.length === 0 ? (
        <div className="text-center py-6 rounded-lg border border-border">
          <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No streams yet</p>
          <Link to="/go-live">
            <Button variant="outline" size="sm" className="mt-2">Start Streaming</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-1.5">
          {userStreams.slice(0, 5).map((stream) => (
            <div key={stream.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
              <Video className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{stream.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{(stream.total_views || 0).toLocaleString()}</span>
                  <span>{stream.created_at ? new Date(stream.created_at).toLocaleDateString() : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
