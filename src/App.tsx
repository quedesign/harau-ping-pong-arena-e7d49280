
import { StrictMode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

// Athlete pages
import TournamentList from "./pages/tournaments/TournamentList";
import TournamentDetail from "./pages/tournaments/TournamentDetail";
import AthleteList from "./pages/athletes/AthleteList";
import AthleteProfile from "./pages/athletes/AthleteProfile";
import AthleteSearch from "./pages/athletes/AthleteSearch";

// Message pages
import MessageList from "./pages/messages/MessageList";
import MessageDetail from "./pages/messages/MessageDetail";

// Admin pages
import CreateTournament from "./pages/admin/CreateTournament";
import ManageTournament from "./pages/admin/ManageTournament";
import MyProfile from "./pages/MyProfile";
import Settings from "./pages/Settings";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>    
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Shared routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tournaments" element={<TournamentList />} />
                <Route path="/tournaments/:id" element={<TournamentDetail />} />
                <Route path="/athletes" element={<AthleteList />} />
                <Route path="/athletes/:id" element={<AthleteProfile />} />
                <Route path="/atletas" element={<AthleteSearch />} />

                {/* Message routes */}
                <Route path="/messages" element={<MessageList />} />
                <Route path="/messages/:id" element={<MessageDetail />} />

                {/* User profile and settings */}
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/settings" element={<Settings />} />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<Navigate to="/dashboard" />} />
                <Route path="/admin/tournaments" element={<Navigate to="/tournaments" />} />
                <Route path="/admin/create-tournament" element={<CreateTournament />} />
                <Route path="/admin/tournaments/:id/manage" element={<ManageTournament />} />
                <Route path="/admin/athletes" element={<Navigate to="/athletes" />} />

                {/* Redirects for old paths */}
                <Route path="/profile" element={<Navigate to="/my-profile" />} />
                <Route path="/admin/profile" element={<Navigate to="/my-profile" />} />
                <Route path="/admin/settings" element={<Navigate to="/settings" />} />

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </DataProvider>
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
  );
};

export default App;
