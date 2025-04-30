
import { useState } from 'react';
import { User } from '@/types';
import { useLogin } from './operations/useLogin';
import { useLogout } from './operations/useLogout';
import { useRegister } from './operations/useRegister';
import { useResetPassword } from './operations/useResetPassword';
import { useTestUser } from './operations/useTestUser';

export const useAuthOperations = () => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);
  const [session, setSession] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false); // Add explicit isLoading state

  const { login, isLoading: isLoginLoading, error: loginError } = useLogin();
  const { logout, isLoading: isLogoutLoading } = useLogout();
  const { register, isLoading: isRegisterLoading, error: registerError } = useRegister();
  const { resetPassword, isLoading: isResetLoading } = useResetPassword();
  const { createTestUser, isLoading: isTestUserLoading } = useTestUser(register, login);

  const combinedIsLoading = isLoginLoading || isLogoutLoading || isRegisterLoading || isResetLoading || isTestUserLoading;
  const error = loginError || registerError;

  return {
    currentUser,
    setCurrentUser,
    isLoading: combinedIsLoading || isLoading, // Combine all loading states
    setIsLoading, // Export the setter
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
