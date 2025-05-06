import React, {
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import { AuthContextType } from "@/contexts/auth/types";

// This file is now deprecated in favor of AuthProvider.tsx
// We're keeping it as a simple reexport to prevent breaking existing imports

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// This component is no longer used directly - see AuthProvider.tsx
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  console.warn('AuthContext.tsx is deprecated. Please import from AuthProvider.tsx instead');
  // The actual implementation is in AuthProvider.tsx
  return null as any; // This should never be used
};

// Reexport the hook from the new file
export { useAuth } from './AuthProvider';
