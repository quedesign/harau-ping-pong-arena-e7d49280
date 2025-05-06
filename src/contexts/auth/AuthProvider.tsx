
import { useEffect, useMemo, useState } from "react";
import { User } from "@/types";
import AuthContext, { AuthContextType } from "./AuthContext";
import { useAuthOperations } from "./useAuthOperations";
import { useLocation, useNavigate } from "react-router-dom";
import { useSessionManagement } from "./hooks/useSessionManagement";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { useMockLogins } from "./hooks/useMockLogins";
import { toast } from "sonner";

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

  // Use our custom hooks
  const { loginWithGithub, loginAsTestUser } = useMockLogins();
  const { refreshSession } = useSessionManagement();
  
  // Set up Supabase auth state listener
  useSupabaseAuth(setCurrentUser);

  // Refresh session when user navigates
  useEffect(() => {
    refreshSession(currentUser);
  }, [pathname, currentUser, refreshSession]);

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
    // Initialize authentication state
    onAuthStateChange();
  }, []);

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login realizado com sucesso!");
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    role: User["role"]
  ) => {
    setIsLoading(true);
    try {
      const success = await register(name, email, password, role);
      if (success) {
        toast.success("Registro realizado com sucesso!");
        // Wait a moment before logging in to ensure registration is complete
        setTimeout(async () => {
          await login(email, password);
          navigate('/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro no registro. Por favor tente novamente.");
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
