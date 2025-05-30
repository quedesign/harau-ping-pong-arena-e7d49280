
import { useState, useEffect } from 'react';
import { readData } from '@/integrations/firebase/utils';
import { User } from '@/types';

interface useGetAthletesResponse {
  athletes: User[];
  isLoading: boolean;
  error: string | null;
}

export const useGetAthletes = (): useGetAthletesResponse => {
  const [athletes, setAthletes] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const users = await readData('users');
        if (users) {
          const athletesArray: User[] = Object.entries(users as Record<string, any>)
            .filter(([, userData]) => (userData as any).role === 'athlete')
            .map(([id, userData]) => ({
              id,
              name: (userData as any).name || '',
              email: (userData as any).email || '',
              role: (userData as any).role || 'athlete',
              profileImage: (userData as any).profile_image,
              createdAt: new Date((userData as any).created_at || Date.now()),
            }));
          setAthletes(athletesArray);
        } else {
          setAthletes([]);
        }
      } catch (err) {
        setError('Error fetching athletes');
        console.error('Error fetching athletes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  return { athletes, isLoading, error };
};
