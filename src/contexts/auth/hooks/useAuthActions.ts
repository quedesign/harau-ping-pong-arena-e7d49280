
import { useState } from 'react';
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { useUserProfileUpdate } from './useUserProfileUpdate';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserProfile } = useUserProfileUpdate();
  
  const loginWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
      }
      // Success handling is managed by the auth state change handler
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    role: User["role"]
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        toast({
          title: "Erro ao registrar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // The profile creation will happen in the onAuthStateChange handler
      toast({
        title: "Registro realizado com sucesso!",
        description: "Sua conta foi criada com sucesso.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro ao tentar registrar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      localStorage.removeItem('sessionTimeout');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>, currentUser: User | null) => {
    return await updateUserProfile(userData, currentUser);
  };

  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Ocorreu um erro ao tentar redefinir sua senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) throw error;
      
      // The rest is handled by the callback
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message || "Ocorreu um erro ao tentar fazer login com Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    updateUser,
    resetPassword,
    loginWithGoogle,
    isAuthLoading: isLoading
  };
}
