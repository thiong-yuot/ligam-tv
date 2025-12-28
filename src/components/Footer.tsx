import { Link, useNavigate } from "react-router-dom";
import { Video, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    product: [
      { name: "Browse Streams", path: "/browse" },
      { name: "Categories", path: "/categories" },
      { name: "Go Live", path: "/go-live" },
      { name: "Pricing", path: "/pricing" },
    ],
    creators: [
      { name: "Creator Dashboard", path: "/dashboard" },
      { name: "Monetization", path: "/monetization" },
      { name: "Analytics", path: "/analytics" },
      { name: "Get Featured", path: "/premium" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
      { name: "Contact", path: "/contact" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Safety", path: "/safety" },
      { name: "Community Guidelines", path: "/guidelines" },
      { name: "FAQ", path: "/faq" },
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Video className="w-4 h-4 text-primary-foreground" />
              </div>
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

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToTop(link.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Creators</h4>
            <ul className="space-y-3">
              {footerLinks.creators.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToTop(link.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToTop(link.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToTop(link.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ligam.tv. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button onClick={() => scrollToTop("/terms")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </button>
            <button onClick={() => scrollToTop("/privacy")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => scrollToTop("/cookies")} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
