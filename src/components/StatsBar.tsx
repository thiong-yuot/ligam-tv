import { Video, Grid3X3, Users } from "lucide-react";

interface StatsBarProps {
  liveStreams?: number;
  categories?: number;
  creators?: string;
}

const StatsBar = ({ liveStreams = 0, categories = 0, creators = "10K+" }: StatsBarProps) => {
  const stats = [
    { icon: Video, value: liveStreams.toString(), label: "Live Streams" },
    { icon: Grid3X3, value: categories.toString(), label: "Categories" },
    { icon: Users, value: creators, label: "Active Creators" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="text-center animate-fadeIn"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <stat.icon className="w-5 h-5 text-primary" />
            <span className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {stat.value}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
