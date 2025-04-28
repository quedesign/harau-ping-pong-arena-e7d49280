
import { useState } from 'react';
import { UserRole } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando processo de registro para:", { name, email, role });
      
      const { data: existingUsers, error: existingError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (existingError) {
        console.error("Erro ao verificar email existente:", existingError);
      }
      
      if (existingUsers) {
        console.log("Email já registrado:", email);
        throw new Error('Este email já está registrado. Tente fazer login.');
      }
      
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

      if (!data.user) {
        console.error("Dados de usuário não retornados");
        throw new Error(t('auth.registerFailed'));
      }

      console.log("Usuário registrado com sucesso:", data.user.id);
      
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
      } else {
        console.log("Perfil criado com sucesso");
      }

      toast.success(t('auth.registerSuccess'), {
        description: t('auth.accountCreated'),
      });

      return true;
    } catch (err) {
      console.error("Detalhes do erro de registro:", err);
      let errorMessage = err instanceof Error ? err.message : t('auth.registerFailed');
      
      if (typeof errorMessage === 'string' && errorMessage.includes('already registered')) {
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

  return { register, isLoading, error };
};
