import { useEffect, useMemo, useState } from "react";
import { User } from "@/types";
import AuthContext from "./AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSupabaseSession } from "./hooks/useSupabaseSession";
import { useAuthActions } from "./hooks/useAuthActions";
import { useSocialLogin } from "./hooks/useSocialLogin";
import { useAuthOperations } from "./useAuthOperations";
import { useSessionManagement } from "./hooks/useSessionManagement";
import { useAdminCheck } from "./hooks/useAdminCheck";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Use our custom hooks
  const { currentUser, setCurrentUser, isLoading, setIsLoading } = useSupabaseSession();
  const { 
    loginWithEmailAndPassword, 
    registerWithEmailAndPassword, 
    logout, 
    updateUser, 
    resetPassword, 
    loginWithGoogle,
    isAuthLoading 
  } = useAuthActions();
  const { loginWithGithub, loginAsTestUser, isSocialLoading } = useSocialLogin();
  const { refreshSession } = useSessionManagement();
  const { isAdmin } = useAdminCheck(currentUser);
  
  // Keep these operations for backward compatibility
  const {
    login,
    register,
    setError: setOperationsError,
    error: operationsError
  } = useAuthOperations();

  // Refresh session when user navigates
  useEffect(() => {
    if (currentUser) {
      refreshSession(currentUser);
    }
  }, [pathname, currentUser, refreshSession]);

  const handleUpdateUser = async (userData: Partial<User>) => {
    const updatedUser = await updateUser(userData, currentUser);
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
  };

  const combinedIsLoading = isLoading || isAuthLoading || isSocialLoading;
  const combinedError = error || operationsError;

  const authContextValue = {
    currentUser,
    isLoading: combinedIsLoading,
    isAdmin,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    resetPassword,
    updateUser: handleUpdateUser,
    loginWithGoogle,
    loginWithGithub,
    loginAsTestUser,
    error: combinedError,
    login,
    register,
    setError,
    setCurrentUser
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};
