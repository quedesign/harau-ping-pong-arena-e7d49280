
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from './types';
import { useAuthOperations } from './useAuthOperations';
import { getCurrentUser } from '@/services/localAuth';
import { UserRole, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setSession,
    login,
    logout,
    register,
    createTestUser,
    resetPassword,
  } = useAuthOperations();

  useEffect(() => {
    console.log("Configurando autenticação local...");
    setIsLoading(true);
    
    // Verificar se há uma sessão ativa
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
    
  }, [setCurrentUser, setIsLoading]);

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register,
    createTestUser,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
