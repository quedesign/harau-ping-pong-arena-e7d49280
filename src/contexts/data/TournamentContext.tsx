
import React, { createContext, useContext, useState } from 'react';
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

const useProvideTournament = (): TournamentContextType => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { loading } = useTournamentFetch(setTournaments);
  const { createTournament, updateTournament, deleteTournament } = useTournamentMutations(setTournaments);
  
  return {
    tournaments,
    loading,
    createTournament,
    updateTournament,
    deleteTournament,
  };
};


const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const { tournaments, loading, createTournament, updateTournament, deleteTournament } = useProvideTournament()
  
  
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
