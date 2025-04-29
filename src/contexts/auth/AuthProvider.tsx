
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from './types';
import { useAuthOperations } from './useAuthOperations';
import { UserRole, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
    setIsLoading(true);

    // Any logic to get the current user should be here if needed
    setIsLoading(false)
  }, [setIsLoading]);

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
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context
}
