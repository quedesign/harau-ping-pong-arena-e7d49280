
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useSocialLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGithub = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // Note: The actual user data will be handled by the onAuthStateChange listener
    } catch (error: any) {
      console.error('Error in GitHub login:', error);
      toast({
        title: "Falha no login",
        description: error?.message || "Erro ao fazer login com GitHub",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsTestUser = async () => {
    setIsLoading(true);
    try {
      // Test user credentials
      const email = "test@example.com";
      const password = "test123456";
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login bem-sucedido",
        description: "Você entrou como usuário de teste"
      });
      
    } catch (error: any) {
      console.error('Error in test user login:', error);
      toast({
        title: "Falha no login",
        description: error?.message || "Erro ao fazer login como usuário de teste",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginWithGithub,
    loginAsTestUser,
    isSocialLoading: isLoading
  };
}
