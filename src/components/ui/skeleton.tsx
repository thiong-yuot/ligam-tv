import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ligam" | "card" | "avatar" | "text";
}

function Skeleton({ className, variant = "ligam", ...props }: SkeletonProps) {
  const variants = {
    default: "animate-pulse bg-muted",
    ligam: "skeleton-ligam",
    card: "skeleton-ligam aspect-video",
    avatar: "skeleton-ligam rounded-full",
    text: "skeleton-ligam h-4",
  };

  return (
    <div
      className={cn("rounded-md", variants[variant], className)}
      {...props}
    />
  );
}

// Composite skeleton components for common patterns
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton variant="card" className="w-full" />
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" className="h-9 w-9" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  );
}

function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="avatar" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="text" className="w-1/3 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonList, SkeletonGrid };
