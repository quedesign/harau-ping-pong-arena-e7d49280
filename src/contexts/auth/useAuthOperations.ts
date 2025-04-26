import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export const useAuthOperations = () => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

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
      // Primeiro, registre o usuário com autenticação
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Verifique se o user foi criado corretamente
      if (!data.user) {
        throw new Error(t('auth.registerFailed'));
      }

      // Crie manualmente um perfil para garantir que existe
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
          },
        ])
        .select('*')
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Não vamos falhar aqui porque o trigger pode ter criado o perfil
      }

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

  return {
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
    createTestUser,
    resetPassword,
  };
};
