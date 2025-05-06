
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Register with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Insert into the users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: name,
            email: email,
            role: role,
            created_at: new Date().toISOString()
          });

        if (insertError) throw insertError;

        // If user is an athlete, create an athlete record
        if (role === 'athlete') {
          const { error: athleteError } = await supabase
            .from('athletes')
            .insert({
              id: authData.user.id,
              level: 'beginner',
              wins: 0,
              losses: 0
            });

          if (athleteError) throw athleteError;
        }

        toast.success(t("auth.registerSuccess"), {
          description: t("auth.accountCreated"),
        });
        return true;
      }
      throw new Error(t("auth.registerFailed"));
    } catch (err: any) {
      console.error("Detalhes do erro de registro:", err);
      const errorMessage = err.message || t("auth.registerFailed");

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
