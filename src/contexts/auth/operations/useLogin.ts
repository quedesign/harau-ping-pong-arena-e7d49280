
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { readData } from '@/integrations/firebase/utils';

export const useLogin = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data from Firebase Realtime Database
      if (userCredential.user) {
        const userData = await readData(`users/${userCredential.user.uid}`);
        if (userData) {
          console.log('User data fetched successfully:', userData);
        } else {
          console.warn('No user data found in database for this user');
        }
      }
      
      console.log('Login successful, redirecting to dashboard');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = t('auth.loginFailed');
      if (err instanceof FirebaseError) {
        errorMessage = err.message;
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

  return { login, isLoading, error };
};
