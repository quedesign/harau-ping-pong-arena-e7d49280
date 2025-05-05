
import { useEffect, useState } from 'react';
import { User } from '@/types/index';
import { useLogin } from './operations/useLogin';
import { useLogout } from './operations/useLogout';
import { useRegister } from './operations/useRegister';
import { useTestUser } from './operations/useTestUser';
import { useResetPassword } from './operations/useResetPassword';
<<<<<<< HEAD
import { getAuth } from 'firebase/auth';
import { database } from '@/integrations/firebase/client';
import { ref, get } from 'firebase/database';
=======
>>>>>>> 605609c8f086d6d7d7a78f62cfaefa565697e810

export const useAuthOperations = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any | null>(null);

  const { login: loginFn, isLoading: loginLoading, error: loginError } = useLogin();
  const { logout, isLoading: logoutLoading } = useLogout();
  const { register, isLoading: registerLoading, error: registerError } = useRegister();
  const { resetPassword, isLoading: resetLoading, error: resetError } = useResetPassword();
  const { createTestUser, isLoading: createTestUserLoading } = useTestUser();

  const login = async (email: string, password: string, onLoginSuccess: (role: string) => void) => {
    try {
      const userCredential = await loginFn(email, password);

      if(userCredential.user){
        const { user } = userCredential;

        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();

          setCurrentUser({ ...userData, id: user.uid });
          setSession(userCredential);
          onLoginSuccess(userData.role);
        }
      }
    } catch (err) {
      console.log(err);
      setError(err as string);
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
  };
};
