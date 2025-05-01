
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getAuth, signOut } from 'firebase/auth';

export const useLogout = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    const auth = getAuth();
    setIsLoading(true);
    try {
      await signOut(auth);
      toast.success(t('auth.logoutSuccess'));
    } catch (err:any) {
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
