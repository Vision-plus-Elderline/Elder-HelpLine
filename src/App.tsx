import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";


import NotFound from "./pages/NotFound";
import { UserPage } from "./components/User";
import Admin from "./components/Admin";
import Analytics from "./components/Analytics";

import Presence from "./Presence/Presence";
import About from "./About/About";
import Contact from "./components/contact";
import FeedbackForm from "./components/FeedbackForm";
import Grievance from "./components/Grievance";
import ProtectedRoute from "./components/ProtectedRoute";

import Privacy from "./components/Privacy";
import Engagement from "./components/Endorsment/Endorsment";
import Assesement from "./components/Endorsment/components/Assesement";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
           <Analytics />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="/presence" element={<Presence />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/grievance" element={<Grievance />} />
            <Route 
              path="/engagement" 
              element={
                <ProtectedRoute>
                  <Engagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/engagement/assesement" 
              element={
                <ProtectedRoute>
                  <Assesement/>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <UserPage/>
                </ProtectedRoute>
              } 
            />
            <Route path="/privacy" element={<Privacy />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
