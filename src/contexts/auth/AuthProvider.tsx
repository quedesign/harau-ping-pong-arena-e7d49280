
import { useEffect, useMemo, useState } from "react";
import { User, UserRole } from "@/types";
import AuthContext, { AuthContextType } from "./AuthContext";
import { useAuthOperations } from "./useAuthOperations";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const {
    login,
    register,
    logout: logoutOperation,
    resetPassword,
    updateUser: updateUserOperation,
    loginWithGoogle,
    currentUser: authCurrentUser,
    setCurrentUser: setAuthCurrentUser,
    isLoading: authIsLoading,
    setIsLoading: setAuthIsLoading,
    error
  } = useAuthOperations();

  // Add missing methods with empty implementations
  const loginWithGithub = async () => {
    console.warn("GitHub login not implemented yet");
    return Promise.resolve();
  };

  const loginAsTestUser = async () => {
    console.warn("Test user login not implemented yet");
    return Promise.resolve();
  };

  const getCurrentUser = async () => {
    return currentUser;
  };

  const onAuthStateChange = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set a longer session timeout (8 hours)
    localStorage.setItem('sessionTimeout', String(Date.now() + 8 * 60 * 60 * 1000));
    
    // Initialize authentication state
    onAuthStateChange();
    
    // Set up session check interval
    const checkSession = () => {
      const timeout = localStorage.getItem('sessionTimeout');
      if (timeout && Date.now() > Number(timeout)) {
        localStorage.removeItem('sessionTimeout');
        logoutOperation();
      } else {
        // Refresh session timeout if user is active
        localStorage.setItem('sessionTimeout', String(Date.now() + 8 * 60 * 60 * 1000));
      }
    };
    
    const sessionInterval = setInterval(checkSession, 60000); // Check every minute
    
    return () => {
      clearInterval(sessionInterval);
    };
  }, []);

  // Refresh session when user navigates
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sessionTimeout', String(Date.now() + 8 * 60 * 60 * 1000));
    }
  }, [pathname, currentUser]);

  // Monitor auth state changes from Supabase
  useEffect(() => {
    const { supabase } = require('@/integrations/supabase/client');
    
    // Set up auth state change listener for Google login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session && session.user) {
          // Fetch user data from profiles table
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }: { data: any }) => {
              if (profile) {
                const user: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profile.name || session.user.user_metadata?.name || 'Usuário',
                  role: profile.role as UserRole,
                  profileImage: profile.profile_image || '',
                  createdAt: new Date(profile.created_at),
                };
                
                setCurrentUser(user);
                
                // Redirect to dashboard after successful login
                if (event === 'SIGNED_IN') {
                  navigate('/dashboard');
                }
              }
            });
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session && session.user) {
        // Fetch user data from profiles table
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }: { data: any }) => {
            if (profile) {
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || session.user.user_metadata?.name || 'Usuário',
                role: profile.role as UserRole,
                profileImage: profile.profile_image || '',
                createdAt: new Date(profile.created_at),
              };
              
              setCurrentUser(user);
            }
          });
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await login(email, password);
      // User is set in the login callback
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    try {
      const success = await register(name, email, password, role);
      // User is set in the register callback
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutOperation();
      setCurrentUser(null);
      localStorage.removeItem('sessionTimeout');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await updateUserOperation(userData);
      // currentUser is updated in the updateUserOperation
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordWrapper = async (email: string): Promise<void> => {
    await resetPassword(email);
  };

  const isAdmin = useMemo(() => {
    return currentUser?.role === "admin";
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    isLoading,
    isAdmin,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    resetPassword: resetPasswordWrapper,
    updateUser,
    loginWithGoogle,
    loginWithGithub,
    loginAsTestUser,
    error,
    login,
    register,
    setError: useAuthOperations().setError,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
