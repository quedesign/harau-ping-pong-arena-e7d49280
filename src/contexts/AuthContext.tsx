
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  createTestUser: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'harauAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get stored users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error(t('auth.invalidCredentials'));
      }
      
      const authenticatedUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.createdAt)
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      
      toast(t('auth.loginSuccess'), {
        description: t('auth.welcomeBack')
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginFailed');
      setError(errorMessage);
      toast(t('common.error'), {
        description: errorMessage
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentUser(null);
      toast(t('auth.logoutSuccess'));
    } catch (err) {
      toast(t('common.error'), {
        description: t('auth.logoutFailed')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error(t('auth.emailAlreadyExists'));
      }
      
      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString()
      };
      
      // Save to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log user in
      const authenticatedUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(newUser.createdAt)
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.registerFailed');
      setError(errorMessage);
      toast(t('common.error'), {
        description: errorMessage
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUser = async () => {
    try {
      const testUser = {
        name: 'Test User',
        email: 'monteiro.barboza@gmail.com',
        password: '123456',
        role: 'athlete' as UserRole
      };
      
      const success = await register(
        testUser.name,
        testUser.email,
        testUser.password,
        testUser.role
      );
      
      if (!success) {
        // If registration fails, try logging in
        return await login(testUser.email, testUser.password);
      }
      
      return true;
    } catch (err) {
      console.error('Error creating test user:', err);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (!userExists) {
        throw new Error(t('auth.userNotFound'));
      }
      
      // In a real app, this would send an email
      // For this demo, we'll just show a success message
      toast(t('auth.resetPasswordSuccess'), {
        description: t('auth.resetPasswordEmailSent')
      });
      
      return true;
    } catch (err) {
      console.error('Reset password error:', err);
      throw err;
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register,
    createTestUser,
    resetPassword
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
