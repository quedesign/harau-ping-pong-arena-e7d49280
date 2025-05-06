
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tournament } from '@/types';
import { useTournamentMutations } from '@/hooks/useTournamentMutations';
import { readData } from '@/integrations/firebase/utils';

interface TournamentContextType {
  tournaments: Tournament[];
  tournament: Tournament | null;
  loading: boolean;
  error: Error | null;
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
  fetchSingleTournament: (id: string) => Promise<void>;
  reload: () => void;
  isLoading?: boolean;
}

const useProvideTournament = (): TournamentContextType => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllTournaments = useCallback(async (): Promise<Tournament[]> => {
    const data = await readData('tournaments');
    if (!data) {
      return [];
    }
    
    const tournamentsArray = Object.entries(data as Record<string, any>).map(([id, tournamentData]) => ({
      id,
      ...tournamentData as any,
      startDate: new Date(tournamentData.startDate as string),
      endDate: new Date(tournamentData.endDate as string),
    }) as Tournament);
    
    return tournamentsArray;
  }, []);

  const fetchTournament = useCallback(async (id: string): Promise<Tournament | undefined> => {
    const data = await readData(`tournaments/${id}`);
    if (!data) {
      throw new Error(`No data returned from fetchTournament with id ${id}`);
    }
    return {
      id,
      ...(data as any),
      startDate: new Date((data as any).startDate),
      endDate: new Date((data as any).endDate),
    } as Tournament;
  }, []);

  const { editTournament, deleteTournament: deleteT } = useTournamentMutations(setTournaments);

  const createTournament = async (tournamentData: Omit<Tournament, 'id'>): Promise<Tournament> => {
    // Implementation
    // This is a mock implementation
    const newTournament = { id: Date.now().toString(), ...tournamentData };
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    await editTournament(id, data);
    const updatedTournament = await fetchTournament(id);
    if (!updatedTournament) {
      throw new Error('Failed to fetch updated tournament');
    }
    return updatedTournament;
  };

  const deleteTournament = async (id: string): Promise<void> => {
    await deleteT(id);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {      
      const allTournaments = await fetchAllTournaments()
      setTournaments(allTournaments);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchAllTournaments]);

  const fetchSingleTournament = useCallback(async (id: string) => {
    try {
      const tournamentData = await fetchTournament(id)
      if(tournamentData){
        setTournament(tournamentData)
      } else {
        throw new Error('Error getting tournament');
      }
      
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [fetchTournament]);

  const reload = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    tournaments,
    tournament,
    loading,
    error,
    createTournament,
    updateTournament,
    deleteTournament,
    fetchSingleTournament,
    reload,
    isLoading: loading,
  };
};

// Creating the context
const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Provider
export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useProvideTournament();

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

// Access hook
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
