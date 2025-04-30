
import { User, UserRole } from '@/types';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  createTestUser: () => Promise<void>;
}
