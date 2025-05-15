
import { useMemo } from 'react';
import { User } from '@/types';

export function useAdminCheck(currentUser: User | null) {
  const isAdmin = useMemo(() => {
    return currentUser?.role === "admin";
  }, [currentUser]);

  return { isAdmin };
}
