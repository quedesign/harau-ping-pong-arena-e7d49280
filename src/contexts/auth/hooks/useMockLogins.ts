
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useMockLogins = () => {
  const { t } = useTranslation();
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
      // This just initiates the OAuth flow
      
    } catch (error: any) {
      console.error('Error in GitHub login:', error);
      toast.error(t("auth.loginFailed", "Falha no login"), { 
        description: error?.message || t("auth.errorGithubLogin", "Erro ao fazer login com GitHub")
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsTestUser = async () => {
    setIsLoading(true);
    try {
      // Test user credentials - in a real app, this would be more secure
      const email = "test@example.com";
      const password = "test123456";
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success(t("auth.loginSuccess", "Login bem-sucedido"), {
        description: t("auth.loggedInAsTestUser", "Você entrou como usuário de teste")
      });
      
    } catch (error: any) {
      console.error('Error in test user login:', error);
      toast.error(t("auth.loginFailed", "Falha no login"), { 
        description: error?.message || t("auth.errorTestUserLogin", "Erro ao fazer login como usuário de teste")
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { loginWithGithub, loginAsTestUser, isLoading };
};
