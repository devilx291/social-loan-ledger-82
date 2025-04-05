
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequestLoan from "./pages/RequestLoan";
import ApproveLoan from "./pages/ApproveLoan";
import LoanHistory from "./pages/LoanHistory";
import { SidebarProvider } from "./components/ui/sidebar";
import Ledger from "./pages/Ledger";
import LoanDetails from "./pages/LoanDetails";
import CreditAssessment from "./pages/CreditAssessment";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import DocumentVerification from "./pages/DocumentVerification";
import MobileVerification from "./pages/MobileVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/request-loan" element={<ProtectedRoute><RequestLoan /></ProtectedRoute>} />
              <Route path="/approve-loans" element={<ProtectedRoute><ApproveLoan /></ProtectedRoute>} />
              <Route path="/loan-history" element={<ProtectedRoute><LoanHistory /></ProtectedRoute>} />
              <Route path="/ledger" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
              <Route path="/loans/:id" element={<ProtectedRoute><LoanDetails /></ProtectedRoute>} />
              <Route path="/credit-assessment" element={<ProtectedRoute><CreditAssessment /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
              <Route path="/document-verification" element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
              <Route path="/mobile-verification" element={<ProtectedRoute><MobileVerification /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
