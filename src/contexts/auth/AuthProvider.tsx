
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from './types';
import { useAuthOperations } from './useAuthOperations';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    login,
    logout,
    register,
    createTestUser,
    resetPassword,
  } = useAuthOperations();

  useEffect(() => {
    setIsLoading(true);
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          // Fetch additional user data from the database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;

          // Combine Supabase auth user with database data
          const fullUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userData.name || 'User',
            role: userData.role || 'athlete',
            profileImage: userData.profile_image || '',
            createdAt: new Date(userData.created_at),
          };
          
          setCurrentUser(fullUser);
          console.log('User authenticated and loaded:', fullUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        console.log('No authenticated user');
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
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
