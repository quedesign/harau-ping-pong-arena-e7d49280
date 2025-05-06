
import { User, UserRole } from '@/types';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, callback?: (userData: User) => void) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  createTestUser: () => Promise<boolean>;
  setError?: (error: string | null) => void;
  loginWithGoogle?: (callback?: (userData: User) => void) => Promise<void>;
}

// FormValues type for LoginForm
export interface FormValues {
  [key: string]: any;
}
