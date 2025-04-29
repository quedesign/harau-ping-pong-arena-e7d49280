
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export const useLogin = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // First authenticate the user
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // If role is provided, we need to verify if the user has the correct role
      if (role) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('email', email)
          .single();

        if (profileError) {
          // If there's an error fetching the profile, sign out and return an error
          await supabase.auth.signOut();
          throw new Error(t('auth.profileNotFound'));
        }

        if (profile.role !== role) {
          // If the user's role doesn't match the selected role, sign out and return an error
          await supabase.auth.signOut();
          throw new Error(`Perfil incorreto. Você não tem acesso como ${role === 'admin' ? 'administrador' : 'atleta'}.`);
        }
      }
      
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

  return { login, isLoading, error };
};
