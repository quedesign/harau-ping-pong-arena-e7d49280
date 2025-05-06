
import { useState, useEffect } from 'react';
import { Match } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface UseMatchFetchReturn {
  matches: Match[];
  loading: boolean;
  error: Error | null;
}

export const useMatchFetch = (athleteId?: string): UseMatchFetchReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        let query = supabase.from('matches').select('*');
        
        if (athleteId) {
          query = query.or(`player_one_id.eq.${athleteId},player_two_id.eq.${athleteId}`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;

        // Transform the data to match the Match type
        const formattedMatches: Match[] = data.map(match => ({
          id: match.id,
          tournamentId: match.tournament_id || undefined,
          playerOneId: match.player_one_id,
          playerTwoId: match.player_two_id,
          scores: {
            playerOne: [],
            playerTwo: []
          },
          winner: undefined,
          scheduledTime: new Date(match.scheduled_time),
          status: match.status as 'scheduled' | 'completed' | 'cancelled',
          location: match.location || undefined
        }));

        setMatches(formattedMatches);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch matches'));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [athleteId]);

  return { matches, loading, error };
};
