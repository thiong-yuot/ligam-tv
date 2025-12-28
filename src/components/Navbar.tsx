import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard, Crown, Sparkles, Search, Bell, Video, Sidebar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LigamLogo from "./LigamLogo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { tier } = useSubscription();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const getPlanBadge = () => {
    if (!user) return null;
    
    if (tier === "pro") {
      return (
        <Link to="/pricing">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1 hover:from-amber-600 hover:to-orange-600 cursor-pointer text-[10px] px-2">
            <Crown className="h-3 w-3" />
            PRO
          </Badge>
        </Link>
      );
    }
    
    if (tier === "creator") {
      return (
        <Link to="/pricing">
          <Badge className="bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground border-0 gap-1 hover:opacity-90 cursor-pointer text-[10px] px-2">
            <Sparkles className="h-3 w-3" />
            CREATOR
          </Badge>
        </Link>
      );
    }
    
    return null;
  };

  const mobileNavLinks = [
    { name: "Home", path: "/" },
    { name: "Trending", path: "/browse" },
    { name: "Live", path: "/live" },
    { name: "Categories", path: "/categories" },
    { name: "Freelance", path: "/freelance" },
    { name: "Tech Hub", path: "/technology" },
    { name: "Merch", path: "/shop" },
    { name: "Plans", path: "/pricing" },
    { name: "FAQ", path: "/faq" },
  ];

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 h-14">
      <div className="h-full px-3 flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-9 w-9 rounded-xl hover:bg-secondary"
                onClick={toggleSidebar}
              >
                <Sidebar className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card border-border">
              {isCollapsed ? "Expand menu" : "Collapse menu"}
            </TooltipContent>
          </Tooltip>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <LigamLogo className="w-8 h-8 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-display font-bold text-foreground hidden sm:block">
              Ligam<span className="text-primary">.tv</span>
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className={`flex w-full transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search streams, creators, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-10 rounded-xl bg-secondary/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 h-10"
              />
            </div>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-xl">
            <Search className="w-4 h-4" />
          </Button>

          {!loading && (
            <>
              {user ? (
                <>
                  {/* Go Live */}
                  <Link to="/go-live" className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="gap-2 rounded-xl h-9 px-3 hover:bg-primary/10 hover:text-primary">
                      <Video className="w-4 h-4" />
                      <span className="hidden lg:inline text-sm">Go Live</span>
                    </Button>
                  </Link>

                  {/* Notifications */}
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-card border-border">
                      Notifications
                    </TooltipContent>
                  </Tooltip>

                  {/* Plan Badge */}
                  <div className="hidden sm:block">
                    {getPlanBadge()}
                  </div>

                  {/* User */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-xl p-0">
                        <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/30 transition-all">
                          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || "User"} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground text-sm font-semibold">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
                      <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-t-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold">{profile?.display_name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg mx-1 my-0.5">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/create-profile")} className="rounded-lg mx-1 my-0.5">
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive rounded-lg mx-1 my-0.5">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex rounded-xl h-9">
                      Log In
                    </Button>
                  </Link>
                  
                  <Link to="/signup">
                    <Button size="sm" className="rounded-xl h-9 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 py-4 px-4 animate-fade-in max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </form>

            {mobileNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="pt-4 mt-2 border-t border-border/50 space-y-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{profile?.display_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {getPlanBadge()}
                </div>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/go-live" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Video className="mr-2 h-4 w-4" />
                    Go Live
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full rounded-xl"
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
              <div className="flex gap-3 pt-4 mt-2 border-t border-border/50">
                <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
