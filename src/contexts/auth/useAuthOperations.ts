
import { useState } from 'react';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';
import { useLogin } from './operations/useLogin';
import { useLogout } from './operations/useLogout';
import { useRegister } from './operations/useRegister';
import { useResetPassword } from './operations/useResetPassword';
import { useTestUser } from './operations/useTestUser';

export const useAuthOperations = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();
  const { logout, isLoading: isLogoutLoading } = useLogout();
  const { register, isLoading: isRegisterLoading, error: registerError } = useRegister();
  const { resetPassword, isLoading: isResetLoading } = useResetPassword();
  const { createTestUser, isLoading: isTestUserLoading } = useTestUser(register, login);

  const isLoading = isLoginLoading || isLogoutLoading || isRegisterLoading || isResetLoading || isTestUserLoading;
  const error = loginError || registerError;

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    error,
    session,
    setSession,
    login,
    logout,
    register,
    createTestUser,
    resetPassword,
  };
};
