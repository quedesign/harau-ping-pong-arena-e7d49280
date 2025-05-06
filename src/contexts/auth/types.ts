
import { User, UserRole } from '@/types';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  registerWithEmailAndPassword: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginAsTestUser: () => Promise<void>;
  error?: string | null;
  login?: (email: string, password: string, callback?: (userData: User) => void) => Promise<boolean>;
  register?: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  setError?: (error: string | null) => void;
  setCurrentUser?: (user: User | null) => void;
}

// FormValues type for LoginForm
export interface FormValues {
  [key: string]: any;
}
