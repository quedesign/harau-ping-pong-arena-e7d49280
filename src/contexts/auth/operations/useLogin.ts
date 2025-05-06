
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { User } from "@/types";

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

    try {
      // Sign in with Supabase
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (authData.user) {
        // Fetch additional user data from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError) throw userError;

        if (userData) {
          const user: User = {
            id: authData.user.id,
            email: authData.user.email || '',
            name: userData.name,
            role: userData.role,
            profileImage: userData.profile_image || '',
            createdAt: new Date(userData.created_at),
          };

          onLoginSuccess(user);
        } else {
          toast.warn(t("auth.noUserData"), { description: t("auth.noUserDataDescription") });
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || t("auth.loginFailed");
      setError(errorMessage);
      toast.error(t("common.error"), { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };
  
  return { login, isLoading, error };
};
