import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Match } from '@/types';
import { database } from '@/integrations/firebase/client';
import { ref, get, set, update, child, push, remove } from 'firebase/database';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  createMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  updateMatch: (matchId: string, data: Partial<Match>) => Promise<void>;
  generateBracket: (tournamentId?: string) => Promise<any>;
  deleteMatch: (matchId: string) => Promise<void>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const formatFirebaseMatch = (match: any, id: string): Match => {
    return {
      id: id,
      tournamentId: match.tournamentId,
      athlete1Id: match.athlete1Id,
      athlete2Id: match.athlete2Id,
      winnerId: match.winnerId || null,
      status: match.status,
    };
  };

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const matchesRef = ref(database, 'matches');
      const snapshot = await get(matchesRef);
      if (snapshot.exists()) {
        const matchesData = snapshot.val();
        const matchesList = Object.keys(matchesData).map((key) =>
          formatFirebaseMatch(matchesData[key], key)
        );
        setMatches(matchesList);
      } else {
        setMatches([]);
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('matches.fetchError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const createMatch = async (match: Omit<Match, 'id'>) => {
    try {
      const matchesRef = child(ref(database), 'matches');
      const newMatchRef = push(matchesRef);
      await set(newMatchRef, match);
      fetchMatches();
    } catch (error) {
      toast.error(t('common.errorCreating'));
    }
  };

  const updateMatch = async (matchId: string, data: Partial<Match>) => {
    try {
      const matchRef = ref(database, `matches/${matchId}`);
      await update(matchRef, data);
      fetchMatches();
    } catch (error) {
      toast.error(t('common.errorUpdating'));
    }
  };

  const generateBracket = async (tournamentId?: string) => {
    try {
      //TODO: Implement
    } catch (error) {
      toast.error(t('common.errorCreating'));
    }
  };

  const deleteMatch = async (matchId: string) => {
    try {
      const matchRef = ref(database, `matches/${matchId}`);
      await remove(matchRef);
      fetchMatches();
    } catch (error) {
      toast.error(t('common.errorDeleting'));
    }
  }

  const value = {
    matches,
    loading,
    createMatch,
    updateMatch,
    generateBracket,
    deleteMatch
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
