
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!currentUser;
  
  React.useEffect(() => {
    // If the user is not logged in and we're trying to access a protected route,
    // redirect to login
    if (!isLoading && !isLoggedIn) {
      const protectedRoutes = ['/dashboard', '/my-profile', '/settings', '/admin'];
      const isProtectedRoute = protectedRoutes.some(route => 
        window.location.pathname.startsWith(route)
      );
      
      if (isProtectedRoute) {
        navigate('/login');
      }
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {isLoggedIn && <Sidebar />}
        <main className={`flex-1 p-6 ${isLoggedIn ? 'ml-0 md:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
