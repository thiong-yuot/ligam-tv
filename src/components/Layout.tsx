import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

const Layout = ({ children, showSidebar = true, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {showSidebar && <Sidebar />}
        <main className={`${showSidebar ? "lg:pl-60" : ""}`}>
          {children}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
