
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from './types';
import { useAuthOperations } from './useAuthOperations';
import { User } from '@/types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { readData } from '@/integrations/firebase/utils';

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
    setIsLoading(true);
    
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase user authenticated:', firebaseUser.uid);
        try {
          // Fetch additional user data from the database
          const userData = await readData(`users/${firebaseUser.uid}`);
          if (userData) {
            // Combine Firebase auth user with database data
            const fullUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name || 'User',
              role: userData.role || 'athlete',
              profileImage: userData.profileImage || '',
              createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
            };
            
            setCurrentUser(fullUser);
            console.log('User authenticated and loaded:', fullUser);
          } else {
            console.warn('No user data found in database');
            // Create minimal user from auth data
            setCurrentUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              role: 'athlete',
              profileImage: '',
              createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
            });
          }
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

    return () => unsubscribe();
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
