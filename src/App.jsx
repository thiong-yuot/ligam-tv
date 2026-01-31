import { Toaster } from "@/components/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { ThemeProvider } from "@/hooks/useTheme";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Browse from "./pages/Browse.jsx";
import Categories from "./pages/Categories.jsx";
import StreamView from "./pages/StreamView.jsx";
import Pricing from "./pages/Pricing.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";
import Freelance from "./pages/Freelance.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import FreelancerProfile from "./pages/FreelancerProfile.jsx";
import Technology from "./pages/Technology.jsx";
import Shop from "./pages/Shop.jsx";
import Auth from "./pages/Auth.jsx";
import CreateProfile from "./pages/CreateProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GoLive from "./pages/GoLive.jsx";
import Monetization from "./pages/Monetization.jsx";
import Analytics from "./pages/Analytics.jsx";
import Premium from "./pages/Premium.jsx";
import Careers from "./pages/Careers.jsx";
import Press from "./pages/Press.jsx";
import Contact from "./pages/Contact.jsx";
import Help from "./pages/Help.jsx";
import HelpCategory from "./pages/HelpCategory.jsx";
import HelpArticle from "./pages/HelpArticle.jsx";
import Safety from "./pages/Safety.jsx";
import Guidelines from "./pages/Guidelines.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Cookies from "./pages/Cookies.jsx";
import NotFound from "./pages/NotFound.jsx";
import Admin from "./pages/Admin.jsx";
import ApiAccess from "./pages/ApiAccess.jsx";
import Messages from "./pages/Messages.jsx";
import Notifications from "./pages/Notifications.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import LearnCourse from "./pages/LearnCourse.jsx";
import CreatorCourses from "./pages/CreatorCourses.jsx";
import MyLearning from "./pages/MyLearning.jsx";
import StreamSetup from "./pages/StreamSetup.jsx";
import Affiliates from "./pages/Affiliates.jsx";
import Discovery from "./pages/Discovery.jsx";
import Reels from "./pages/Reels.jsx";
import UserProfile from "./pages/UserProfile.jsx";

const queryClient = new QueryClient();

const App = () => (
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
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/live" element={<Browse />} />
                <Route path="/freelance" element={<Freelance />} />
                <Route path="/freelance/dashboard" element={<FreelancerDashboard />} />
                <Route path="/freelance/:id" element={<FreelancerProfile />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/signup" element={<Auth mode="signup" />} />
                <Route path="/create-profile" element={<CreateProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/go-live" element={<GoLive />} />
                <Route path="/monetization" element={<Monetization />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/help/:slug" element={<HelpCategory />} />
                <Route path="/help/article/:id" element={<HelpArticle />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/guidelines" element={<Guidelines />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/api-access" element={<ApiAccess />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/learn/:courseId" element={<LearnCourse />} />
                <Route path="/creator/courses" element={<CreatorCourses />} />
                <Route path="/my-learning" element={<MyLearning />} />
                <Route path="/stream-setup" element={<StreamSetup />} />
                <Route path="/affiliates" element={<Affiliates />} />
                <Route path="/eelai" element={<Discovery />} />
                <Route path="/reels" element={<Reels />} />
                <Route path="/@:username" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
