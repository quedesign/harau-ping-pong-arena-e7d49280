
import { useState, useEffect } from 'react';
import { Match } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

export const useMatchFetch = () => {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_scores(*)
        `)
        .order('scheduled_time', { ascending: true });
      
      if (error) throw error;

      if (data) {
        const formattedMatches: Match[] = data.map(item => {
          const scores = {
            playerOne: [] as number[],
            playerTwo: [] as number[]
          };

          if (Array.isArray(item.match_scores)) {
            item.match_scores.sort((a, b) => a.set_number - b.set_number);
            
            item.match_scores.forEach(score => {
              scores.playerOne.push(score.player_one_score);
              scores.playerTwo.push(score.player_two_score);
            });
          }

          let winner: string | undefined;
          if (item.status === 'completed') {
            const playerOneWins = scores.playerOne.filter((score, index) => 
              score > scores.playerTwo[index]
            ).length;
            
            const playerTwoWins = scores.playerTwo.filter((score, index) => 
              score > scores.playerOne[index]
            ).length;
            
            if (playerOneWins > playerTwoWins) {
              winner = item.player_one_id;
            } else if (playerTwoWins > playerOneWins) {
              winner = item.player_two_id;
            }
          }

          return {
            id: item.id,
            tournamentId: item.tournament_id,
            playerOneId: item.player_one_id,
            playerTwoId: item.player_two_id,
            scores,
            winner,
            scheduledTime: new Date(item.scheduled_time),
            status: item.status as 'scheduled' | 'completed' | 'cancelled',
            location: item.location
          };
        });

        setMatches(formattedMatches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: t('common.error'),
        description: t('matches.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    matches,
    setMatches,
    loading
  };
};
