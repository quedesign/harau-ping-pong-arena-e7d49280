
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useResetPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (email: string) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading };
};
