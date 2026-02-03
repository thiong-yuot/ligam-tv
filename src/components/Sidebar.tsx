import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Heart, Clock, Settings, Users, Gamepad2, Music, Palette, Trophy } from "lucide-react";
import streamer1 from "@/assets/streamer-1.jpg";
import streamer2 from "@/assets/streamer-2.jpg";
import streamer3 from "@/assets/streamer-3.jpg";

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { icon: Home, name: "Home", path: "/" },
    { icon: Compass, name: "Browse", path: "/browse" },
    { icon: Heart, name: "Following", path: "/following" },
    { icon: Clock, name: "History", path: "/history" },
  ];

  const categories = [
    { icon: Gamepad2, name: "Gaming", path: "/category/gaming" },
    { icon: Music, name: "Music", path: "/category/music" },
    { icon: Palette, name: "Art", path: "/category/art" },
    { icon: Trophy, name: "Esports", path: "/category/esports" },
  ];

  const recommendedStreamers = [
    { name: "NightOwl", avatar: streamer1, isLive: true, viewers: 15420 },
    { name: "GameMaster", avatar: streamer2, isLive: true, viewers: 8930 },
    { name: "StreamQueen", avatar: streamer3, isLive: false, viewers: 0 },
  ];

  const isActive = (path: string) => location.pathname === path;

  const formatViewers = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 bg-sidebar border-r border-sidebar-border overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Menu
          </h3>
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(cat.path)
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Recommended Channels */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Recommended
          </h3>
          <div className="space-y-2">
            {recommendedStreamers.map((streamer) => (
              <Link
                key={streamer.name}
                to={`/channel/${streamer.name.toLowerCase()}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent transition-all duration-200"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">{streamer.name.charAt(0).toUpperCase()}</span>
                  </div>
                  {streamer.isLive && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-destructive rounded-full border-2 border-sidebar" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sidebar-foreground truncate">
                    {streamer.name}
                  </p>
                  {streamer.isLive && (
                    <p className="text-xs text-muted-foreground">
                      {formatViewers(streamer.viewers)} viewers
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="pt-4 border-t border-sidebar-border">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
