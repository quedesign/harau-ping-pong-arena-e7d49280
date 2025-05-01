import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';



export const useLogin = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const auth = getAuth();

    try {
        await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      let errorMessage = t('auth.loginFailed');
      if (err instanceof FirebaseError) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(t('common.error'), {
        description: errorMessage,
      });
      return false
    } finally{
        setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
