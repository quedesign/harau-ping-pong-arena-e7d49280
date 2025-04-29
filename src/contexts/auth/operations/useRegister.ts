
import { useState } from 'react';
import { UserRole } from '@/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { registerLocalUser } from '@/services/localAuth';

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando processo de registro para:", { name, email, role });
      
      // Registrar usuário localmente
      registerLocalUser(name, email, password, role);
      
      toast.success(t('auth.registerSuccess'), {
        description: t('auth.accountCreated'),
      });

      return true;
    } catch (err) {
      console.error("Detalhes do erro de registro:", err);
      let errorMessage = err instanceof Error ? err.message : t('auth.registerFailed');
      
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
