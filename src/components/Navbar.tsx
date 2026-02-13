import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, User, LogOut, LayoutDashboard, MessageCircle, Bell, Search, ShoppingCart } from "lucide-react";
import CartSheet from "./CartSheet";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadCount } from "@/hooks/useMessages";
import { useUnreadNotificationsCount } from "@/hooks/useNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import LigamLogo from "./LigamLogo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: unreadNotifications = 0 } = useUnreadNotificationsCount();
  const { totalItems } = useCart();
  const navLinks = [
    { name: "Browse", path: "/browse" },
    { name: "Learn", path: "/courses" },
    { name: "Freelance", path: "/freelance" },
    { name: "Shop", path: "/shop" },
    { name: "Pricing", path: "/pricing" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.display_name) return profile.display_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <LigamLogo className="w-8 h-8" />
            <span className="text-lg font-display font-bold text-foreground">
              Ligam<span className="text-primary">.tv</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            }}
            className="hidden md:flex relative max-w-xs flex-1 mx-4"
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-card border-border"
            />
          </form>

          <div className="flex items-center gap-2">
            <CartSheet
              trigger={
                <Button variant="ghost" size="icon" className="relative h-8 w-8">
                  <ShoppingCart className="w-4 h-4" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              }
            />
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/create-profile")}>
                        <User className="mr-2 h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/messages")}>
                        <MessageCircle className="mr-2 h-4 w-4" /> Messages
                        {unreadCount > 0 && <Badge variant="default" className="ml-auto text-xs h-5">{unreadCount}</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/notifications")}>
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                        {unreadNotifications > 0 && <Badge variant="default" className="ml-auto text-xs h-5">{unreadNotifications}</Badge>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                    <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
                  </div>
                )}
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-2 pt-3 mt-2 border-t border-border">
                  <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">Sign Up</Button>
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
