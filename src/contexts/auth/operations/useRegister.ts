import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { writeData } from "@/integrations/firebase/utils";

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user?.uid) {
        const userFirebase = {
          name: name,
          email: email,
          role: role,
        }

        await writeData(`users/${user.uid}`, userFirebase)

        toast.success(t("auth.registerSuccess"), {
          description: t("auth.accountCreated"),
        });
        return true;
      }
      throw new Error(t("auth.registerFailed"));
    } catch (err) {
      console.error("Detalhes do erro de registro:", err);
      const errorMessage =
        err instanceof Error ? err.message : t("auth.registerFailed");

      setError(errorMessage);
      toast.error(t("common.error"), {
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  return { register, isLoading, error };
};
