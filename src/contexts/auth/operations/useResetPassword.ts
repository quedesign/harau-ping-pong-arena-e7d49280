
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";

export const useResetPassword = () => {
    const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    const auth = getAuth();

    try {
        await sendPasswordResetEmail(auth, email);

        toast.success(t("auth.resetPasswordSuccess"), {
        description: t('auth.resetPasswordEmailSent')
        });

        return true;
    } catch (err) {
        let errorMessage = t('auth.resetPasswordFailed');
        if (err instanceof FirebaseError) {
            errorMessage = err.message;
        }
        console.error("Reset password error:", err);

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
