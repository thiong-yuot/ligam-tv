import { Link } from "react-router-dom";
import { Twitter, Instagram, Youtube, Linkedin, Video, ArrowRight, Sparkles } from "lucide-react";
import LigamLogo from "./LigamLogo";

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: "Browse Streams", path: "/browse" },
      { name: "Categories", path: "/categories" },
      { name: "Marketplace", path: "/shop" },
      { name: "Freelancers", path: "/freelance" },
      { name: "Learn", path: "/courses" },
      { name: "Eelai AI", path: "/eelai", highlight: true },
      { name: "Pricing", path: "/pricing" },
      { name: "Get Featured", path: "/premium" },
      { name: "Affiliates", path: "/affiliates" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Technology", path: "/technology" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
      { name: "Contact", path: "/contact" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "FAQ", path: "/faq" },
      { name: "Safety", path: "/safety" },
      { name: "Community Guidelines", path: "/guidelines" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <LigamLogo className="h-10 w-10" />
              <span className="text-xl font-display font-bold text-foreground">
                Ligam<span className="text-primary">.tv</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Stream, Connect & Monetize. The next generation live streaming platform.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors inline-flex items-center gap-1.5 ${
                      link.highlight 
                        ? "text-primary font-medium hover:text-primary/80" 
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.highlight && <Sparkles className="w-3 h-3" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Stream Setup Promo Card */}
            <Link 
              to="/stream-setup"
              className="mt-6 block p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Video className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">Start Streaming</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Learn how to set up OBS, get your stream key, and go live in minutes.
              </p>
              <span className="inline-flex items-center text-xs text-primary group-hover:gap-2 transition-all">
                Read the guide <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ligam.tv. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;