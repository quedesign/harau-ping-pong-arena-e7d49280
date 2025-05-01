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
}

const useProvideTournament = (): TournamentContextType => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllTournaments = useCallback(async (): Promise<Tournament[]> => {
    const data = await readData('tournaments');
    if (!data) {
      throw new Error('No data returned from fetchAllTournaments');
    }
    const tournamentsArray = Object.entries(data).map(([id, tournamentData]) => ({
      id,
      ...tournamentData,
      startDate: new Date(tournamentData.startDate),
      endDate: new Date(tournamentData.endDate),
    })) as Tournament[];
    return tournamentsArray;
  }, []);

  const fetchTournament = useCallback(async (id: string): Promise<Tournament | undefined> => {
    const data = await readData(`tournaments/${id}`);
    if (!data) {
      throw new Error(`No data returned from fetchTournament with id ${id}`);
    }
    return {
      id,
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    } as Tournament;
  }, []);

  const { createTournament, updateTournament, deleteTournament } = useTournamentMutations(setTournaments);

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
  }, []);

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
  }, []);

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
  };
};

// Criação do contexto
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

// Hook de acesso
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};