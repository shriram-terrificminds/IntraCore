import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComplaintsDemo from "./pages/ComplaintsDemo";
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Index />} /> {/* Add this route for login page */}
          <Route
            path="/reset-password"
            element={<ResetPasswordForm onBackToLogin={() => window.location.href = '/'} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordForm onBackToLogin={() => window.location.href = '/'} />}
          />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
