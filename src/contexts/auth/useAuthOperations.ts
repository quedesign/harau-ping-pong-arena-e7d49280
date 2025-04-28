import React, { useState } from 'react';
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
      toast.error(t('common.error'), {
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
      setCurrentUser(null);
      toast.success(t('auth.logoutSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('auth.logoutFailed');
      toast.error(t('common.error'), {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando processo de registro para:", { name, email, role });
      
      // Registra o usuário com autenticação
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

      if (signUpError) {
        console.error("Erro no cadastro:", signUpError);
        throw signUpError;
      }

      // Verifica se o user foi criado corretamente
      if (!data.user) {
        console.error("Dados de usuário não retornados");
        throw new Error(t('auth.registerFailed'));
      }

      console.log("Usuário registrado com sucesso:", data.user.id);
      
      // Cria manualmente um perfil para garantir que existe
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
          },
        ]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Mesmo com erro no perfil, continuamos pois o trigger pode ter criado o perfil
      }

      toast.success(t('auth.registerSuccess'), {
        description: t('auth.accountCreated'),
      });

      return true;
    } catch (err) {
      console.error("Detalhes do erro de registro:", err);
      let errorMessage = err instanceof Error ? err.message : t('auth.registerFailed');
      
      // Melhor tratamento de erros comuns
      if (errorMessage.includes('already registered')) {
        errorMessage = 'Este email já está registrado. Tente fazer login.';
      }
      
      setError(errorMessage);
      toast.error(t('common.error'), {
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
        name: 'Usuário de Teste',
        email: 'teste@exemplo.com',
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
      console.error('Erro ao criar usuário de teste:', err);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(t('auth.resetPasswordSuccess'), {
        description: t('auth.resetPasswordEmailSent'),
      });

      return true;
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
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
