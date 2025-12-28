import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Heart, Clock, Settings, Users, Gamepad2, Music, Palette, Trophy, Video, Play, Briefcase, Cpu, ShoppingBag, CreditCard, HelpCircle, Info, FileText, Mail, Shield, BookOpen, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import LigamLogo from "./LigamLogo";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainLinks = [
    { icon: Home, name: "Home", path: "/" },
    { icon: Compass, name: "Browse", path: "/browse" },
    { icon: Play, name: "Live Now", path: "/live" },
  ];

  const personalLinks = [
    { icon: Heart, name: "Following", path: "/following" },
    { icon: Clock, name: "History", path: "/history" },
  ];

  const exploreLinks = [
    { icon: Gamepad2, name: "Gaming", path: "/category/gaming" },
    { icon: Music, name: "Music", path: "/category/music" },
    { icon: Palette, name: "Art", path: "/category/art" },
    { icon: Trophy, name: "Esports", path: "/category/esports" },
  ];

  const moreLinks = [
    { icon: Briefcase, name: "Freelance", path: "/freelance" },
    { icon: Cpu, name: "Technology", path: "/technology" },
    { icon: ShoppingBag, name: "Shop", path: "/shop" },
    { icon: CreditCard, name: "Pricing", path: "/pricing" },
    { icon: HelpCircle, name: "FAQ", path: "/faq" },
  ];

  const recommendedStreamers = [
    { name: "NightOwl", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", isLive: true, viewers: 15420 },
    { name: "GameMaster", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", isLive: true, viewers: 8930 },
    { name: "StreamQueen", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", isLive: false, viewers: 0 },
  ];

  // Footer Links (moved from Footer component)
  const footerLinks = {
    company: [
      { name: "About", path: "/about" },
      { name: "Press", path: "/press" },
      { name: "Careers", path: "/careers" },
      { name: "Contact", path: "/contact" },
    ],
    legal: [
      { name: "Terms", path: "/terms" },
      { name: "Privacy", path: "/privacy" },
      { name: "Safety", path: "/safety" },
      { name: "Guidelines", path: "/guidelines" },
    ],
  };

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

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-60 bg-sidebar border-r border-sidebar-border hidden lg:flex flex-col">
      <ScrollArea className="flex-1">
        <div className="py-3">
          {/* Main Navigation */}
          <nav className="px-3 space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-secondary text-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </nav>

          <Separator className="my-3 bg-sidebar-border" />

          {/* Personal */}
          <div className="px-3">
            <h3 className="px-3 text-sm font-semibold text-foreground mb-2">You</h3>
            <nav className="space-y-1">
              {personalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-secondary text-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <Separator className="my-3 bg-sidebar-border" />

          {/* Recommended Channels */}
          <div className="px-3">
            <h3 className="px-3 text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              Subscriptions
            </h3>
            <div className="space-y-1">
              {recommendedStreamers.map((streamer) => (
                <Link
                  key={streamer.name}
                  to={`/channel/${streamer.name.toLowerCase()}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={streamer.avatar}
                      alt={streamer.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    {streamer.isLive && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full border border-sidebar" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sidebar-foreground truncate text-sm">
                      {streamer.name}
                    </p>
                  </div>
                  {streamer.isLive && (
                    <span className="text-xs text-muted-foreground">
                      {formatViewers(streamer.viewers)}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <Separator className="my-3 bg-sidebar-border" />

          {/* Explore */}
          <div className="px-3">
            <h3 className="px-3 text-sm font-semibold text-foreground mb-2">Explore</h3>
            <nav className="space-y-1">
              {exploreLinks.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(cat.path)
                      ? "bg-secondary text-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <cat.icon className="w-5 h-5" />
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <Separator className="my-3 bg-sidebar-border" />

          {/* More from Ligam */}
          <div className="px-3">
            <h3 className="px-3 text-sm font-semibold text-foreground mb-2">More from Ligam</h3>
            <nav className="space-y-1">
              {moreLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-secondary text-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <Separator className="my-3 bg-sidebar-border" />

          {/* Settings */}
          <div className="px-3">
            <Link
              to="/settings"
              className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <Link
              to="/help"
              className="flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
            >
              <HelpCircle className="w-5 h-5" />
              Help
            </Link>
          </div>

          <Separator className="my-3 bg-sidebar-border" />

          {/* Footer Section */}
          <div className="px-6 py-3">
            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
              {footerLinks.company.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToTop(link.path)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
              {footerLinks.legal.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToTop(link.path)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-2 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Ligam.tv
            </p>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
