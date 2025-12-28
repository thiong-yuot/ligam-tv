import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Categories from "./pages/Categories";
import StreamView from "./pages/StreamView";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Freelance from "./pages/Freelance";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerProfile from "./pages/FreelancerProfile";
import Technology from "./pages/Technology";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import CreateProfile from "./pages/CreateProfile";
import Dashboard from "./pages/Dashboard";
import GoLive from "./pages/GoLive";
import Monetization from "./pages/Monetization";
import Analytics from "./pages/Analytics";
import Premium from "./pages/Premium";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Safety from "./pages/Safety";
import Guidelines from "./pages/Guidelines";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ApiAccess from "./pages/ApiAccess";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import SellerDashboard from "./pages/SellerDashboard";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
