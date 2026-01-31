import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children, showSidebar = true, showFooter = true, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      <div className={showNavbar ? "pt-16" : ""}>
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
