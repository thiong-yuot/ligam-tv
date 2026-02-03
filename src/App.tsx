import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Categories from "./pages/Categories";
import StreamView from "./pages/StreamView";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import GoLive from "./pages/GoLive";
import StreamSetup from "./pages/StreamSetup";
import Shop from "./pages/Shop";
import Freelance from "./pages/Freelance";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LearnCourse from "./pages/LearnCourse";
import MyLearning from "./pages/MyLearning";
import CreatorCourses from "./pages/CreatorCourses";
import Premium from "./pages/Premium";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import HelpCategory from "./pages/HelpCategory";
import HelpArticle from "./pages/HelpArticle";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Guidelines from "./pages/Guidelines";
import Safety from "./pages/Safety";
import Technology from "./pages/Technology";
import Discovery from "./pages/Discovery";
import Reels from "./pages/Reels";
import CreateProfile from "./pages/CreateProfile";
import Admin from "./pages/Admin";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";
import Monetization from "./pages/Monetization";
import SellerDashboard from "./pages/SellerDashboard";
import Affiliates from "./pages/Affiliates";
import ApiAccess from "./pages/ApiAccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/stream/:id" element={<StreamView />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/go-live" element={<GoLive />} />
                  <Route path="/stream-setup" element={<StreamSetup />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/freelance" element={<Freelance />} />
                  <Route path="/freelancer/:id" element={<FreelancerProfile />} />
                  <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/learn/:id" element={<LearnCourse />} />
                  <Route path="/my-learning" element={<MyLearning />} />
                  <Route path="/creator-courses" element={<CreatorCourses />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/press" element={<Press />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/help/:categorySlug" element={<HelpCategory />} />
                  <Route path="/help/:categorySlug/:articleId" element={<HelpArticle />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/guidelines" element={<Guidelines />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/technology" element={<Technology />} />
                  <Route path="/discovery" element={<Discovery />} />
                  <Route path="/reels" element={<Reels />} />
                  <Route path="/create-profile" element={<CreateProfile />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/monetization" element={<Monetization />} />
                  <Route path="/seller-dashboard" element={<SellerDashboard />} />
                  <Route path="/affiliates" element={<Affiliates />} />
                  <Route path="/api-access" element={<ApiAccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
