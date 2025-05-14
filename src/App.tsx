import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TenantProvider } from "./contexts/TenantContext";
import { AuthProvider } from "./contexts/AuthContext";
import { StrictMode } from "react";
import { PrivateRoute } from "./components/PrivateRoute";

// Pages imports
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RecoverPassword from "./pages/auth/RecoverPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/inventory/Products";
import ServiceOrders from "./pages/orders/ServiceOrders";
import PurchaseRequests from "./pages/purchases/PurchaseRequests";
import Invoices from "./pages/invoices/Invoices";
import Expenses from "./pages/expenses/Expenses";
import NotFound from "./pages/NotFound";
import StockMovements from "./pages/inventory/StockMovements";
import FinancialEntries from "./pages/financial/FinancialEntries";
import CashFlow from "./pages/financial/CashFlow";
import NewServiceOrder from "./pages/orders/NewServiceOrder";
import NewInvoice from "./pages/invoices/NewInvoice";
import ClientsSuppliers from "./pages/clientsSuppliers/ClientsSuppliers";
import Profile from './pages/profile/Profile';
import Settings from "./pages/settings/Settings";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recover-password" element={<RecoverPassword />} />

                {/* Root redirect */}
                <Route path="/" element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" replace />
                  </PrivateRoute>
                } />

                {/* Protected routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/index" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/inventory" element={<PrivateRoute><Products /></PrivateRoute>} />
                <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
                <Route path="/invoices/new" element={<PrivateRoute><NewInvoice /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><ServiceOrders /></PrivateRoute>} />
                <Route path="/orders/new" element={<PrivateRoute><NewServiceOrder /></PrivateRoute>} />
                <Route path="/purchases" element={<PrivateRoute><PurchaseRequests /></PrivateRoute>} />
                <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
                <Route path="/financial/entries" element={<PrivateRoute><FinancialEntries /></PrivateRoute>} />
                <Route path="/financial/cash-flow" element={<PrivateRoute><CashFlow /></PrivateRoute>} />
                <Route path="/clients-suppliers" element={<PrivateRoute><ClientsSuppliers /></PrivateRoute>} />

                {/* Special routes */}
                <Route path="/unauthorized" element={<PrivateRoute><Unauthorized /></PrivateRoute>} />
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </TooltipProvider>
        </BrowserRouter>
      </TenantProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;