import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { User } from "@/types";
import { readData } from '@/integrations/firebase/utils';

export const useLogin = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (
    email: string,
    password: string,
    onLoginSuccess: (userData: User) => void
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data from Firebase Realtime Database
      if (userCredential.user) {
        const userData = await readData(`users/${userCredential.user.uid}`);
        console.log('User data retrieved:', userData);
        if (userData) {
          onLoginSuccess(userData as User)
        } else {
            toast.warn(t("auth.noUserData"), { description: t("auth.noUserDataDescription") });
        }
      }
    } catch (err: unknown) {
      let errorMessage = t("auth.loginFailed");
      if (err instanceof FirebaseError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(t("common.error"), { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};