
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const register = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando processo de registro para:", { email });
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
      toast.success(t("auth.registerSuccess"), {
        description: t("auth.accountCreated"),
      });
      return true;
    } catch (err) {
      console.error("Detalhes do erro de registro:", err);
      let errorMessage = err instanceof Error ? err.message : t("auth.registerFailed");
      setError(errorMessage);
      toast.error(t("common.error"), {
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }
  return { register, isLoading, error }
};
