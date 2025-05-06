
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { User, AuthContextType } from "@/types";
import { useAuthOperations } from "./useAuthOperations";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    login,
    logout,
    register,
    resetPassword,
    createTestUser,
    loginWithGoogle,
  } = useAuthOperations();

  const value: AuthContextType = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register,
    resetPassword,
    createTestUser,
    setError,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
