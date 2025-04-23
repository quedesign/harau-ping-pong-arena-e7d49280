
import React, { createContext, useContext } from 'react';
import { Tournament } from '@/types';
import { useTournamentFetch } from '@/hooks/useTournamentFetch';
import { useTournamentMutations } from '@/hooks/useTournamentMutations';

interface TournamentContextType {
  tournaments: Tournament[];
  loading: boolean;
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tournaments, setTournaments, loading } = useTournamentFetch();
  const { createTournament, updateTournament, deleteTournament } = useTournamentMutations(setTournaments);
  
  const value = {
    tournaments,
    loading,
    createTournament,
    updateTournament,
    deleteTournament
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
