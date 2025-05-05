
import { useEffect, useState } from 'react';
import { User } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { useLogin } from './operations/useLogin';
import { useLogout } from './operations/useLogout';
import { useRegister } from './operations/useRegister';
import { useTestUser } from './operations/useTestUser';
import { useResetPassword } from './operations/useResetPassword';
import { database } from '@/integrations/firebase/client';
import { ref, get, set } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { readData, writeData } from '@/integrations/firebase/utils';
import { toast } from 'sonner';

export const useAuthOperations = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any | null>(null);

  const { t } = useTranslation();
  const { login: loginFn, isLoading: loginLoading, error: loginError } = useLogin();
  const { logout, isLoading: logoutLoading } = useLogout();
  const { register, isLoading: registerLoading, error: registerError } = useRegister();
  const { resetPassword, isLoading: resetLoading, error: resetError } = useResetPassword();
  const { createTestUser, isLoading: createTestUserLoading } = useTestUser();

  const login = async (email: string, password: string, onLoginSuccess: (userData: User) => void) => {
    try {
      await loginFn(email, password, (userData) => {
        setCurrentUser(userData);
        onLoginSuccess(userData);
      });
    } catch (err) {
      console.log(err);
      setError(err as string);
    }
  };

  const loginWithGoogle = async (onLoginSuccess?: (userData: User) => void) => {
    setIsLoading(true);
    setError(null);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google auth successful, user:', user);

      if (user?.uid) {
        const userData = await readData(`users/${user.uid}`);
        console.log('User data from database:', userData);
        
        if (userData) {
          // Combine Firebase auth user with database data
          const fullUser: User = {
            id: user.uid,
            email: user.email || '',
            name: userData.name || user.displayName || 'User',
            role: userData.role || 'athlete',
            profileImage: userData.profileImage || user.photoURL || '',
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
          };
          
          setCurrentUser(fullUser);
          if (onLoginSuccess) onLoginSuccess(fullUser);
          toast.success(t('auth.loginSuccess', 'Login realizado com sucesso!'));
          
        } else {
          // Create new user in database if not exists
          console.log('Creating new user in database');
          const newUser = {
            name: user.displayName || 'User',
            email: user.email,
            role: 'athlete',
            profileImage: user.photoURL || '',
            createdAt: new Date().toISOString()
          };
          
          await writeData(`users/${user.uid}`, newUser);
          
          const fullUser: User = {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || 'User',
            role: 'athlete',
            profileImage: user.photoURL || '',
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
          };
          
          setCurrentUser(fullUser);
          if (onLoginSuccess) onLoginSuccess(fullUser);
          toast.success(t('auth.accountCreated', 'Conta criada com sucesso!'));
        }
      }
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

  return {
    currentUser,
    setCurrentUser,
    isLoading: isLoading || loginLoading || logoutLoading || registerLoading || resetLoading || createTestUserLoading,
    setIsLoading,
    error: error || loginError || registerError || resetError,
    setError,
    session,
    setSession,
    login,
    logout,
    register,
    resetPassword,
    createTestUser,
    loginWithGoogle
  };
};
