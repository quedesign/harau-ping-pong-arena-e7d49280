
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useResetPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (resetError) {
        throw resetError;
      }
      
      toast.success(t("auth.resetPasswordSuccess"), { 
        description: t('auth.resetPasswordEmailSent')
      });
      
      return true;
    } catch (err: any) {
      console.error("Reset password error:", err);
      
      const errorMessage = err?.message || t('auth.resetPasswordFailed');
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
