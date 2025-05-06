
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';

export const useSessionManagement = () => {
  const [sessionTimeout, setSessionTimeout] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize and manage session timeout
  useEffect(() => {
    // Set a longer session timeout (8 hours)
    const timeout = Date.now() + 8 * 60 * 60 * 1000;
    localStorage.setItem('sessionTimeout', String(timeout));
    setSessionTimeout(String(timeout));
    
    // Set up session check interval
    const checkSession = () => {
      const timeout = localStorage.getItem('sessionTimeout');
      if (timeout && Date.now() > Number(timeout)) {
        localStorage.removeItem('sessionTimeout');
        // Logout will be handled by the parent component
        return true;
      } else {
        // Refresh session timeout if user is active
        localStorage.setItem('sessionTimeout', String(Date.now() + 8 * 60 * 60 * 1000));
        return false;
      }
    };
    
    const sessionInterval = setInterval(checkSession, 60000); // Check every minute
    
    return () => {
      clearInterval(sessionInterval);
    };
  }, []);

  // Refresh session when user navigates
  const refreshSession = (currentUser: User | null) => {
    if (currentUser) {
      localStorage.setItem('sessionTimeout', String(Date.now() + 8 * 60 * 60 * 1000));
    }
  };

  return { refreshSession };
};
