
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!currentUser;
  
  useEffect(() => {
    // Se o usuário não estiver logado e estiver tentando acessar uma rota protegida
    if (!isLoading && !isLoggedIn) {
      const protectedRoutes = ['/dashboard', '/my-profile', '/settings', '/admin', '/tournaments', '/athletes', '/messages'];
      const isProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      if (isProtectedRoute) {
        console.log('Redirecionando rota protegida para login:', location.pathname);
        navigate('/login', { state: { from: location.pathname } });
      }
    }
    
    // Se o usuário estiver logado e estiver tentando acessar uma página de autenticação
    if (!isLoading && isLoggedIn) {
      const authRoutes = ['/login', '/register', '/forgot-password'];
      const isAuthRoute = authRoutes.some(route => location.pathname === route);
      
      if (isAuthRoute) {
        console.log('Usuário já logado, redirecionando para dashboard');
        navigate('/dashboard');
      }
    }
  }, [isLoading, isLoggedIn, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
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
