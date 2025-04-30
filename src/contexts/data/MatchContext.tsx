import React, { createContext, useContext, useState, useEffect } from 'react';
import { Match } from '@/types';
import { fetchMatches } from '@/services/fetchMatches';
import { useMatchFetch } from '@/hooks/useMatchFetch';
import { useMatchMutations } from '@/hooks/useMatchMutations';

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  createMatch: (match: Omit<Match, 'id' | 'tournamentId'>) => Promise<Match>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<Match>;
  generateBracket: (tournamentId?: string) => Promise<any>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    matches: fetchedMatches,
    loading: isLoading,
    createMatch: createMatchMutation,
    updateMatch: updateMatchMutation,
    generateBracket,
  } = useMatchMutations(setMatches);

  useEffect(() => {
    setLoading(true);
    fetchMatches().then((matches) => {
      setMatches(matches)
    }).finally(() => setLoading(false));
  }, [setMatches]);

  const value = {
    matches,
    loading,
    createMatch: async (match: Omit<Match, 'id' | 'tournamentId'>) =>
      await createMatchMutation(match),
    updateMatch: async (id: string, data: Partial<Match>) =>
      await updateMatchMutation(id, data),
    generateBracket,
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
