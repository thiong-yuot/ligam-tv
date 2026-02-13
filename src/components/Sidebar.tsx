import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Gamepad2, Music, Palette, Trophy } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { icon: Home, name: "Home", path: "/" },
    { icon: Compass, name: "Browse", path: "/browse" },
  ];

  const categories = [
    { icon: Gamepad2, name: "Gaming", path: "/category/gaming" },
    { icon: Music, name: "Music", path: "/category/music" },
    { icon: Palette, name: "Art", path: "/category/art" },
    { icon: Trophy, name: "Esports", path: "/category/esports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-48 bg-card border-r border-border overflow-y-auto hidden lg:block">
      <div className="p-3 space-y-4">
        <nav className="space-y-0.5">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(link.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div>
          <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Categories</p>
          <nav className="space-y-0.5">
            {categories.map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(cat.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
