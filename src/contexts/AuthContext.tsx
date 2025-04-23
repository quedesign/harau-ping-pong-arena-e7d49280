
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  createTestUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // Use setTimeout to avoid potential Supabase deadlocks
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }
      
      if (data) {
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          profileImage: data.profile_image,
          createdAt: new Date(data.created_at)
        };
        setCurrentUser(user);
      } else {
        console.error('No user profile found for:', userId);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomeBack'),
      });
      
      return true;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginFailed');
      setError(errorMessage);
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast({
        title: t('auth.logoutSuccess'),
      });
    } catch (err) {
      toast({
        title: t('common.error'),
        description: t('auth.logoutFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (checkError) {
        throw new Error(checkError.message);
      }
      
      if (existingUsers && existingUsers.length > 0) {
        throw new Error(t('auth.emailAlreadyExists'));
      }
      
      // If email doesn't exist, proceed with registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: t('auth.registerSuccess'),
        description: t('auth.accountCreated'),
      });
      
      return true;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.registerFailed');
      setError(errorMessage);
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createTestUser = async () => {
    setIsLoading(true);
    try {
      // First check if the test user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', 'monteiro.barboza@gmail.com')
        .limit(1);
      
      if (checkError) {
        console.error('Error checking existing user:', checkError.message);
        toast({
          title: t('common.error'),
          description: checkError.message,
          variant: 'destructive',
        });
        return false;
      }
      
      // If user already exists, try to log them in directly
      if (existingUsers && existingUsers.length > 0) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'monteiro.barboza@gmail.com',
          password: '123456'
        });
        
        if (error) {
          toast({
            title: t('common.error'),
            description: 'Test user exists but cannot login: ' + error.message,
            variant: 'destructive',
          });
          return false;
        }
        
        toast({
          title: 'Success',
          description: 'Logged in as existing test user',
        });
        return true;
      }
      
      // Create new test user if doesn't exist
      const { data, error } = await supabase.auth.signUp({
        email: 'monteiro.barboza@gmail.com',
        password: '123456',
        options: {
          data: {
            name: 'Test User',
            role: 'athlete'
          }
        }
      });

      if (error) {
        console.error('Error creating test user:', error.message);
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: t('auth.testUserCreated'),
        description: 'Test user created successfully',
      });
      return true;
    } catch (err) {
      console.error('Unexpected error creating test user:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register,
    createTestUser
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
