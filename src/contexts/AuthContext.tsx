
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up Supabase auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Get user profile data
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setCurrentUser({
                id: session.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                profileImage: profile.profile_image,
                createdAt: new Date(session.user.created_at)
              });
            }
          });
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setCurrentUser({
                id: session.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                profileImage: profile.profile_image,
                createdAt: new Date(session.user.created_at)
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginFailed');
      setError(errorMessage);
      toast(t('common.error'), {
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast(t('auth.logoutSuccess'));
    } catch (err) {
      toast(t('common.error'), {
        description: t('auth.logoutFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      toast(t('auth.registerSuccess'), {
        description: t('auth.accountCreated'),
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.registerFailed');
      setError(errorMessage);
      toast(t('common.error'), {
        description: errorMessage,
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
        role: 'athlete' as UserRole,
      };

      const success = await register(
        testUser.name,
        testUser.email,
        testUser.password,
        testUser.role
      );

      if (!success) {
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast(t('auth.resetPasswordSuccess'), {
        description: t('auth.resetPasswordEmailSent'),
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
