import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-14">
        {showSidebar && <Sidebar />}
        <main className={cn(
          "transition-all duration-300",
          showSidebar && (isCollapsed ? "lg:pl-[72px]" : "lg:pl-60")
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
