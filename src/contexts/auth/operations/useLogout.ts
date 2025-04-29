
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useLogout = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success(t('auth.logoutSuccess'));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('auth.logoutFailed');
      toast.error(t('common.error'), {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};
