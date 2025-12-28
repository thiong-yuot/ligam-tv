import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14">
        {showSidebar && <Sidebar />}
        <main className={`${showSidebar ? "lg:pl-60" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
