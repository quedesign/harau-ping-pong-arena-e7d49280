
import { Match } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useMatchCreate = (setMatches: React.Dispatch<React.SetStateAction<Match[]>>) => {
  const createMatch = async (matchData: Omit<Match, 'id'>): Promise<Match> => {
    const { scheduledTime, scores, ...rest } = matchData;
    
    const matchInsertData = {
      tournament_id: rest.tournamentId,
      player_one_id: rest.playerOneId,
      player_two_id: rest.playerTwoId,
      scheduled_time: scheduledTime.toISOString(),
      status: rest.status,
      location: rest.location
    };
    
    const { data, error } = await supabase
      .from('matches')
      .insert(matchInsertData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from create');

    if (scores && (scores.playerOne.length > 0 || scores.playerTwo.length > 0)) {
      const scoresData = [];
      
      for (let i = 0; i < Math.max(scores.playerOne.length, scores.playerTwo.length); i++) {
        scoresData.push({
          match_id: data.id,
          set_number: i + 1,
          player_one_score: scores.playerOne[i] || 0,
          player_two_score: scores.playerTwo[i] || 0
        });
      }
      
      if (scoresData.length > 0) {
        await supabase.from('match_scores').insert(scoresData);
      }
    }

    const newMatch: Match = {
      id: data.id,
      tournamentId: data.tournament_id,
      playerOneId: data.player_one_id,
      playerTwoId: data.player_two_id,
      scores: scores || { playerOne: [], playerTwo: [] },
      winner: rest.winner,
      scheduledTime: new Date(data.scheduled_time),
      status: data.status as 'scheduled' | 'completed' | 'cancelled',
      location: data.location
    };
    
    setMatches(prev => [...prev, newMatch]);
    return newMatch;
  };

  return { createMatch };
};
