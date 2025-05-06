
import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useTranslation } from 'react-i18next';
import { useLogin } from './operations/useLogin';
import { useLogout } from './operations/useLogout';
import { useRegister } from './operations/useRegister';
import { useTestUser } from './operations/useTestUser';
import { useResetPassword } from './operations/useResetPassword';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthOperations = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();
  const { login: loginFn, isLoading: loginLoading, error: loginError } = useLogin();
  const { logout, isLoading: logoutLoading } = useLogout();
  const { register, isLoading: registerLoading, error: registerError } = useRegister();
  const { resetPassword, isLoading: resetLoading, error: resetError } = useResetPassword();
  const { createTestUser, isLoading: createTestUserLoading } = useTestUser(register, loginFn);

  const login = async (email: string, password: string, callback?: (userData: User) => void) => {
    try {
      return await loginFn(email, password, (userData) => {
        setCurrentUser(userData);
        if (callback) callback(userData);
      });
    } catch (err) {
      console.log(err);
      setError(err as string);
      return false;
    }
  };

  const loginWithGoogle = async (callback?: (userData: User) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      // Note: The actual user data will be handled by the onAuthStateChange listener
      // This just initiates the OAuth flow
      
    } catch (error: any) {
      console.error('Error in Google login:', error);
      setError(error?.message || t("auth.errorGoogleLogin", "Erro ao fazer login com Google"));
      toast.error(t("auth.loginFailed", "Falha no login"), { 
        description: error?.message || t("auth.errorGoogleLogin", "Erro ao fazer login com Google")
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add updateUser function
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          // Add other fields as needed
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Update local state
      setCurrentUser({
        ...currentUser,
        ...userData,
      });
      
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      setError(error?.message || "Failed to update user profile");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentUser,
    setCurrentUser,
    isLoading: isLoading || loginLoading || logoutLoading || registerLoading || resetLoading || createTestUserLoading,
    setIsLoading,
    error: error || loginError || registerError || resetError,
    setError,
    login,
    logout,
    register,
    resetPassword,
    createTestUser,
    loginWithGoogle,
    updateUser  // Export the new updateUser function
  };
};
