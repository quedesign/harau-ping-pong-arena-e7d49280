
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export const useResetPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(t("auth.resetPasswordSuccess"), {
        description: t('auth.resetPasswordEmailSent')
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || t('auth.resetPasswordFailed');
      setError(errorMessage);

      toast.error(t('common.error'), {
        description: errorMessage,
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { resetPassword, isLoading, error };
};
