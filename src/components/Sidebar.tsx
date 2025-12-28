import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Heart, Clock, Settings, Gamepad2, Music, Palette, Trophy, Play, Briefcase, Cpu, ShoppingBag, CreditCard, HelpCircle, Twitter, Instagram, Youtube, Linkedin, Zap, TrendingUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import LigamLogo from "./LigamLogo";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();

  const mainLinks = [
    { icon: Home, name: "Home", path: "/" },
    { icon: TrendingUp, name: "Trending", path: "/browse" },
    { icon: Zap, name: "Live", path: "/live" },
  ];

  const discoverLinks = [
    { icon: Gamepad2, name: "Gaming", path: "/category/gaming" },
    { icon: Music, name: "Music", path: "/category/music" },
    { icon: Palette, name: "Creative", path: "/category/art" },
    { icon: Trophy, name: "Esports", path: "/category/esports" },
  ];

  const libraryLinks = [
    { icon: Heart, name: "Following", path: "/following" },
    { icon: Clock, name: "Watch Later", path: "/history" },
  ];

  const exploreLinks = [
    { icon: Briefcase, name: "Freelance", path: "/freelance" },
    { icon: Cpu, name: "Tech Hub", path: "/technology" },
    { icon: ShoppingBag, name: "Merch", path: "/shop" },
    { icon: CreditCard, name: "Plans", path: "/pricing" },
  ];

  const recommendedStreamers = [
    { name: "NightOwl", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", isLive: true, viewers: 15420 },
    { name: "GameMaster", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isLive: true, viewers: 8930 },
    { name: "StreamQueen", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", isLive: false, viewers: 0 },
  ];

  const quickLinks = [
    { name: "About", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const formatViewers = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const scrollToTop = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const NavLink = ({ icon: Icon, name, path }: { icon: React.ElementType; name: string; path: string }) => {
    const content = (
      <Link
        to={path}
        className={cn(
          "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group",
          isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
          isActive(path)
            ? "bg-primary/15 text-primary border-l-2 border-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        )}
      >
        <Icon className={cn(
          "flex-shrink-0 transition-colors",
          isCollapsed ? "w-5 h-5" : "w-4 h-4",
          isActive(path) ? "text-primary" : "group-hover:text-foreground"
        )} />
        {!isCollapsed && <span>{name}</span>}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium bg-card border-border">
            {name}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    !isCollapsed ? (
      <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">
        {children}
      </h3>
    ) : null
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 bottom-0 bg-background/95 backdrop-blur-sm border-r border-border/50 hidden lg:flex flex-col transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <ScrollArea className="flex-1">
        <div className="py-4">
          {/* Main Navigation */}
          <div className="mb-6">
            <SectionTitle>Menu</SectionTitle>
            <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-2")}>
              {mainLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </nav>
          </div>

          {/* Discover */}
          <div className="mb-6">
            <SectionTitle>Discover</SectionTitle>
            <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-2")}>
              {discoverLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </nav>
          </div>

          {/* Library */}
          <div className="mb-6">
            <SectionTitle>Library</SectionTitle>
            <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-2")}>
              {libraryLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </nav>
          </div>

          {/* Following/Subscriptions */}
          <div className="mb-6">
            <SectionTitle>Following</SectionTitle>
            <div className={cn("space-y-0.5", isCollapsed ? "px-2" : "px-2")}>
              {recommendedStreamers.map((streamer) => {
                const content = (
                  <Link
                    key={streamer.name}
                    to={`/channel/${streamer.name.toLowerCase()}`}
                    className={cn(
                      "flex items-center rounded-xl text-sm transition-all duration-200 group",
                      isCollapsed ? "justify-center p-2" : "gap-3 px-4 py-2",
                      "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={streamer.avatar}
                        alt={streamer.name}
                        className={cn(
                          "rounded-full object-cover ring-2 transition-all",
                          isCollapsed ? "w-7 h-7" : "w-7 h-7",
                          streamer.isLive ? "ring-primary/50" : "ring-transparent"
                        )}
                      />
                      {streamer.isLive && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <p className="font-medium truncate text-sm group-hover:text-foreground">
                          {streamer.name}
                        </p>
                        {streamer.isLive && (
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            LIVE
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={streamer.name} delayDuration={0}>
                      <TooltipTrigger asChild>{content}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium bg-card border-border">
                        <div className="flex items-center gap-2">
                          <span>{streamer.name}</span>
                          {streamer.isLive && (
                            <span className="text-[10px] font-bold text-primary">● LIVE</span>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return content;
              })}
            </div>
          </div>

          {/* Explore More */}
          <div className="mb-6">
            <SectionTitle>Explore</SectionTitle>
            <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-2")}>
              {exploreLinks.map((link) => (
                <NavLink key={link.path} {...link} />
              ))}
            </nav>
          </div>

          {/* Settings & Help */}
          <div className="mb-6">
            <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-2")}>
              <NavLink icon={Settings} name="Settings" path="/settings" />
              <NavLink icon={HelpCircle} name="Support" path="/help" />
            </nav>
          </div>

          {/* Footer - Only when expanded */}
          {!isCollapsed && (
            <div className="px-4 pt-4 border-t border-border/50">
              {/* Quick Links */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                {quickLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToTop(link.path)}
                    className="text-[11px] text-muted-foreground/70 hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              {/* Social */}
              <div className="flex gap-1.5 mb-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>

              {/* Brand */}
              <div className="flex items-center gap-2 mb-2">
                <LigamLogo className="w-4 h-4" />
                <span className="text-xs font-semibold text-muted-foreground">Ligam.tv</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
