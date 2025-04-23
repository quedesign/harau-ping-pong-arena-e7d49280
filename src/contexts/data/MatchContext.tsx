
import React, { createContext, useContext } from 'react';
import { Match } from '@/types';
import { useMatchFetch } from '@/hooks/useMatchFetch';
import { useMatchMutations } from '@/hooks/useMatchMutations';

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  createMatch: (match: Omit<Match, 'id'>) => Promise<Match>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<Match>;
  generateBracket: (tournamentId?: string) => Promise<any>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { matches, setMatches, loading } = useMatchFetch();
  const { createMatch, updateMatch, generateBracket } = useMatchMutations(setMatches);

  const value = {
    matches,
    loading,
    createMatch,
    updateMatch,
    generateBracket
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};
