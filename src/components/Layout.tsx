import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showNavbar?: boolean;
}

const Layout = ({ children, showFooter = true, showNavbar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-14" : ""}>
        <main>
          {children}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
