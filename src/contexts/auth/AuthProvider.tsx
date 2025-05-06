
import { useEffect, useMemo, useState } from "react";
import { User, UserRole } from "@/types";
import AuthContext, { AuthContextType } from "./AuthContext";
import { useAuthOperations } from "./useAuthOperations";
import { useLocation } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  
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

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        setCurrentUser(user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    setIsLoading(true);
    try {
      const user = await register(name, email, password, role as UserRole);
      if (user) {
        setCurrentUser(user);
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
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updatedUser = await updateUserOperation({
        ...currentUser,
        ...userData,
      });
      setCurrentUser(updatedUser);
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
