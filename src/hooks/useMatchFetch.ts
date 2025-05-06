
import { useState, useEffect, useCallback } from 'react';
import { Match } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const useMatchFetch = (tournamentId?: string) => {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('matches')
        .select('*');
      
      // If tournamentId is provided, filter by it
      if (tournamentId) {
        query = query.eq('tournament_id', tournamentId);
      }
      
      const { data, error: apiError } = await query;
      
      if (apiError) throw apiError;

      if (data) {
        const formattedMatches: Match[] = data.map(item => ({
          id: item.id,
          tournamentId: item.tournament_id,
          playerOneId: item.player_one_id,
          playerTwoId: item.player_two_id,
          scores: {
            playerOne: [],
            playerTwo: []
          },
          winner: undefined, // Set as undefined since it's not in the database response
          scheduledTime: new Date(item.scheduled_time),
          status: item.status as 'scheduled' | 'completed' | 'cancelled',
          location: item.location
        }));

        setMatches(formattedMatches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [tournamentId]);
  
  useEffect(() => {    
      fetchMatches();    
  }, [fetchMatches]);

  // Return proper values based on whether we're fetching for a tournament or all matches  
  return tournamentId 
    ? { matches, isLoading, error }
    : { matches, setMatches, loading };
};
