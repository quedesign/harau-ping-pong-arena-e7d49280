<<<<<<< HEAD
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { User } from "@/types";

interface LoginError {
  message: string;
}
=======

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { readData } from '@/integrations/firebase/utils';
>>>>>>> 605609c8f086d6d7d7a78f62cfaefa565697e810

export const useLogin = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string,
    onLoginSuccess: (user: User) => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const auth = getAuth();
    const db = getDatabase();

<<<<<<< HEAD
    try {      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      onLoginSuccess(userData as User);
    } catch (err: unknown) {
      let errorMessage = t("auth.loginFailed");      
=======
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
>>>>>>> 605609c8f086d6d7d7a78f62cfaefa565697e810
      if (err instanceof FirebaseError) {
        errorMessage = err.message;
      }else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage);
<<<<<<< HEAD
      toast.error(t("common.error"), { description: errorMessage });
      throw new Error(errorMessage);
    } 
    finally {
=======
      toast.error(t('common.error'), {
        description: errorMessage,
      });
      return false;
    } finally {
>>>>>>> 605609c8f086d6d7d7a78f62cfaefa565697e810
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
