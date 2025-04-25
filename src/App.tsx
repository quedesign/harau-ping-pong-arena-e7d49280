
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

// Athlete pages
import TournamentList from "./pages/tournaments/TournamentList";
import TournamentDetail from "./pages/tournaments/TournamentDetail";
import AthleteList from "./pages/athletes/AthleteList";
import AthleteProfile from "./pages/athletes/AthleteProfile";

// Message pages
import MessageList from "./pages/messages/MessageList";
import MessageDetail from "./pages/messages/MessageDetail";

// Admin pages
import CreateTournament from "./pages/admin/CreateTournament";
import ManageTournament from "./pages/admin/ManageTournament";
import MyProfile from "./pages/MyProfile";

const queryClient = new QueryClient();

// Componente para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Componente para App
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/tournaments" element={
          <ProtectedRoute>
            <TournamentList />
          </ProtectedRoute>
        } />
        
        <Route path="/tournaments/:id" element={
          <ProtectedRoute>
            <TournamentDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/athletes" element={
          <ProtectedRoute>
            <AthleteList />
          </ProtectedRoute>
        } />
        
        <Route path="/athletes/:id" element={
          <ProtectedRoute>
            <AthleteProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <AthleteProfile />
          </ProtectedRoute>
        } />
        
        {/* My Profile page */}
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } />
        
        {/* Message routes */}
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessageList />
          </ProtectedRoute>
        } />
        
        <Route path="/messages/:id" element={
          <ProtectedRoute>
            <MessageDetail />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/tournaments" element={
          <ProtectedRoute>
            <Navigate to="/tournaments" />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/create-tournament" element={
          <ProtectedRoute>
            <CreateTournament />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/tournaments/:id/manage" element={
          <ProtectedRoute>
            <ManageTournament />
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
