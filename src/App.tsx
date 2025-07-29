import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Pages
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import CarDetails from "./pages/CarDetails";
import LoanCalculator from "./pages/LoanCalculator";
import AIRecommend from "./pages/AIRecommend";
import Founder from "./pages/Founder";
import Team from "./pages/Team";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:carId" element={<CarDetails />} />
                <Route path="/loan-calculator" element={<LoanCalculator />} />
                <Route path="/ai-recommend" element={<AIRecommend />} />
                <Route path="/founder" element={<Founder />} />
                <Route path="/team" element={<Team />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/auth" element={<Auth />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
