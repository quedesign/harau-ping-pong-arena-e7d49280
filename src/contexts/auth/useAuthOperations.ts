
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

  const loginWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('user', user);

      if (user?.uid) {
        const userData = await readData(`users/${user.uid}`);
        console.log('userData', userData);
        
        if (userData) {
          // Combine Firebase auth user with database data
          const fullUser: User = {
            id: user.uid,
            email: user.email || '',
            name: userData.name || 'User',
            role: userData.role || 'athlete',
            profileImage: userData.profileImage || '',
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
          };
          setCurrentUser(fullUser);
        } else {
          const userFirebase = {
            name: user.displayName,
            email: user.email,
            role: 'athlete',
          }
          await writeData(`users/${user.uid}`, userFirebase);
          setCurrentUser({
            id: user.uid,
            email: user.email || '',
            name: user.displayName || 'User',
            role: 'athlete',
            profileImage: '',
            createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
          });
        }
      }
    } catch (error) {
      setError(t("auth.errorGoogleLogin"));
      console.error('Error in Google login:', error);
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
