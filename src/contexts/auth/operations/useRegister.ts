
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from "@/types";

export const useRegister = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
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
        console.log("Auth data received:", authData.user);
        
        try {
          // First check if a profile already exists for this user
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single();
            
          // If profile doesn't exist, insert it
          if (!existingProfile) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                name: name,
                email: email,
                role: role,
              });

            if (insertError) {
              console.error("Error creating profile:", insertError);
              throw insertError;
            }
          }

          // If user is an athlete, create an athlete profile record
          if (role === 'athlete') {
            // Check if athlete profile already exists
            const { data: existingAthleteProfile } = await supabase
              .from('athlete_profiles')
              .select('user_id')
              .eq('user_id', authData.user.id)
              .single();
              
            // If athlete profile doesn't exist, create it
            if (!existingAthleteProfile) {
              const { error: athleteError } = await supabase
                .from('athlete_profiles')
                .insert({
                  user_id: authData.user.id,
                  level: 'beginner',
                  handedness: 'right',
                  city: 'São Paulo',
                  state: 'SP',
                  country: 'Brasil',
                  wins: 0,
                  losses: 0
                });

              if (athleteError) {
                console.error("Error creating athlete profile:", athleteError);
                throw athleteError;
              }
            }
          }
        } catch (err: any) {
          // If the error is due to duplicate key, it means the profile was already created
          // This can happen when auth is created but the function continues execution
          if (err.code !== '23505') { // PostgreSQL duplicate key violation error code
            throw err;
          } else {
            console.warn("Profile already exists, continuing with registration");
          }
        }

        toast.success(t("auth.registerSuccess"), {
          description: t("auth.accountCreated"),
        });
        return true;
      }
      throw new Error(t("auth.registerFailed"));
    } catch (err: any) {
      console.error("Register error details:", err);
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
