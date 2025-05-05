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

    try {      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();
      onLoginSuccess(userData as User);
    } catch (err: unknown) {
      let errorMessage = t("auth.loginFailed");      
      if (err instanceof FirebaseError) {
        errorMessage = err.message;
      }else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage);
      toast.error(t("common.error"), { description: errorMessage });
      throw new Error(errorMessage);
    } 
    finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
