import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard, Crown, Sparkles, MessageCircle, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useUnreadCount } from "@/hooks/useMessages";
import { useUnreadNotificationsCount } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LigamLogo from "./LigamLogo";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { tier } = useSubscription();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: unreadNotifications = 0 } = useUnreadNotificationsCount();

  const getPlanBadge = () => {
    if (!user) return null;
    
    if (tier === "pro") {
      return (
        <Link to="/pricing">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1 hover:from-amber-600 hover:to-orange-600 cursor-pointer">
            <Crown className="h-3 w-3" />
            Pro
          </Badge>
        </Link>
      );
    }
    
    if (tier === "creator") {
      return (
        <Link to="/pricing">
          <Badge className="bg-gradient-to-r from-primary to-purple-500 text-white border-0 gap-1 hover:from-primary/90 hover:to-purple-600 cursor-pointer">
            <Sparkles className="h-3 w-3" />
            Creator
          </Badge>
        </Link>
      );
    }
    
    return (
      <Link to="/pricing">
        <Badge variant="outline" className="gap-1 hover:bg-secondary cursor-pointer">
          Free
        </Badge>
      </Link>
    );
  };

  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "Categories", path: "/categories" },
    { name: "Freelance", path: "/freelance" },
    { name: "Shop", path: "/shop" },
    { name: "Pricing", path: "/pricing" },
  ];

  const moreLinks = [
    { name: "About", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Help", path: "/help" },
    { name: "FAQ", path: "/faq" },
  ];

  const allNavLinks = [...mainLinks, ...moreLinks];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <LigamLogo className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xl font-display font-bold text-foreground">
              Ligam<span className="text-primary">.tv</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* More Dropdown for secondary links */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  More
                  <Menu className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.path} onClick={() => navigate(link.path)}>
                    {link.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user && getPlanBadge()}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center gap-2 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/create-profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/messages")}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Messages
                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto h-5 min-w-5 flex items-center justify-center text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/notifications")}>
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        {unreadNotifications > 0 && (
                          <Badge variant="default" className="ml-auto h-5 min-w-5 flex items-center justify-center text-xs">
                            {unreadNotifications}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="hidden sm:flex">
                        Log In
                      </Button>
                    </Link>
                    
                    <Link to="/signup">
                      <Button variant="default" size="sm" className="hidden sm:flex">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t border-border bg-background animate-fadeIn max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {/* Main Navigation Links */}
              <div className="pb-2 mb-2 border-b border-border">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Navigation</p>
                {mainLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2.5 text-sm font-medium rounded-md flex items-center ${
                      isActive(link.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* More Links */}
              <div className="pb-2 mb-2 border-b border-border">
                <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">More</p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2.5 text-sm font-medium rounded-md flex items-center ${
                      isActive(link.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* User Section */}
              {user ? (
                <div className="space-y-2">
                  <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</p>
                  <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {getPlanBadge()}
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/messages" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Messages
                      {unreadCount > 0 && (
                        <Badge variant="default" className="ml-auto">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Link to="/notifications" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      {unreadNotifications > 0 && (
                        <Badge variant="default" className="ml-auto">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Button
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                  <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
