import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from "react";
import { User } from "@/types";
import { useAuthOperations } from "./useAuthOperations";

interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  session: any | null;
  setSession: (session: any | null) => void;
  login: (email: string, password: string, onLoginSuccess: (userData: User) => void) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    user: Omit<User, "id" | "createdAt">,
    onRegisterSuccess: (userData: User) => void,
  ) => Promise<void>;
  resetPassword: (email: string, onResetSuccess: () => void) => Promise<void>;
  createTestUser: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    session,
    setSession,
    login,
    logout,
    register,
    resetPassword,
    createTestUser,
    loginWithGoogle,
  } = useAuthOperations();

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    session,
    setSession,
    login,
    logout,
    register,
    resetPassword,
    createTestUser,
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