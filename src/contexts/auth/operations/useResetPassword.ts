import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useResetPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
        .then(() => {
            toast.success(t("auth.resetPasswordSuccess"),{ description: t('auth.resetPasswordEmailSent') })
        })
        .catch((err) => {
            toast.error(t('errors.login'))
        })
        .finally(() => setIsLoading(false));
  };

  return { resetPassword, isLoading };
};
