import { forwardRef } from "react";
import { Link } from "react-router-dom";
import LigamLogo from "./LigamLogo";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const links = [
    { name: "Browse", path: "/browse" },
    { name: "Shop", path: "/shop" },
    { name: "Freelance", path: "/freelance" },
    { name: "Learn", path: "/courses" },
    { name: "About", path: "/about" },
    { name: "Help", path: "/help" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer ref={ref} className="bg-card border-t border-border">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <LigamLogo className="h-8 w-8" />
            <span className="text-lg font-display font-bold text-foreground">
              Ligam<span className="text-primary">.tv</span>
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ligam.tv
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
