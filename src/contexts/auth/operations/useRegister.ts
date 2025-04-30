
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { UserRole } from "@/types";

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Iniciando processo de registro para:", { name, email, role });
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }
      if (data?.user?.id) {
        const { error: dbError } = await supabase.from("users").insert({
          id: data.user.id,
          name,
          email,
          role,
        });
        if (dbError) {
          throw dbError;
        }

        toast.success(t("auth.registerSuccess"), {
          description: t("auth.accountCreated"),
        });
        return true;
      }
      throw new Error(t("auth.registerFailed"));
    } catch (err) {
      console.error("Detalhes do erro de registro:", err);
      const errorMessage = err instanceof Error ? err.message : t("auth.registerFailed");
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
