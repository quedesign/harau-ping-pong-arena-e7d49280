
import { useState } from 'react';
import { User } from '@/types';
import { useLogin } from './operations/useLogin';
import { useLogout } from './operations/useLogout';
import { useRegister } from './operations/useRegister';
import { useTestUser } from './operations/useTestUser';
import { useResetPassword } from './operations/useResetPassword';

export const useAuthOperations = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any | null>(null);

  const { login, isLoading: loginLoading, error: loginError } = useLogin();
  const { logout, isLoading: logoutLoading } = useLogout();
  const { register, isLoading: registerLoading, error: registerError } = useRegister();
  const { resetPassword, isLoading: resetLoading, error: resetError } = useResetPassword();
  const { createTestUser, isLoading: createTestUserLoading } = useTestUser();

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
