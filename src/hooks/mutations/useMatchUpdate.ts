
import { Match } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useMatchUpdate = (setMatches: React.Dispatch<React.SetStateAction<Match[]>>) => {
  const updateMatch = async (id: string, matchData: Partial<Match>): Promise<Match> => {
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (matchData.tournamentId) updateData.tournament_id = matchData.tournamentId;
    if (matchData.playerOneId) updateData.player_one_id = matchData.playerOneId;
    if (matchData.playerTwoId) updateData.player_two_id = matchData.playerTwoId;
    if (matchData.scheduledTime) updateData.scheduled_time = matchData.scheduledTime.toISOString();
    if (matchData.status) updateData.status = matchData.status;
    if (matchData.location !== undefined) updateData.location = matchData.location;
    
    if (Object.keys(updateData).length > 1) {
      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned from update');
    }

    if (matchData.scores) {
      await supabase
        .from('match_scores')
        .delete()
        .eq('match_id', id);
      
      const scoresData = [];
      
      for (let i = 0; i < Math.max(matchData.scores.playerOne.length, matchData.scores.playerTwo.length); i++) {
        scoresData.push({
          match_id: id,
          set_number: i + 1,
          player_one_score: matchData.scores.playerOne[i] || 0,
          player_two_score: matchData.scores.playerTwo[i] || 0
        });
      }
      
      if (scoresData.length > 0) {
        await supabase.from('match_scores').insert(scoresData);
      }
    }

    const { data: matchData2, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        match_scores(*)
      `)
      .eq('id', id)
      .single();
    
    if (matchError) throw matchError;
    if (!matchData2) throw new Error('No data returned from fetch');

    const scores = {
      playerOne: [] as number[],
      playerTwo: [] as number[]
    };

    if (Array.isArray(matchData2.match_scores)) {
      matchData2.match_scores.sort((a, b) => a.set_number - b.set_number);
      
      matchData2.match_scores.forEach(score => {
        scores.playerOne.push(score.player_one_score);
        scores.playerTwo.push(score.player_two_score);
      });
    }

    let winner: string | undefined = matchData.winner;
    if (matchData.status === 'completed' && !winner) {
      const playerOneWins = scores.playerOne.filter((score, index) => 
        score > scores.playerTwo[index]
      ).length;
      
      const playerTwoWins = scores.playerTwo.filter((score, index) => 
        score > scores.playerOne[index]
      ).length;
      
      if (playerOneWins > playerTwoWins) {
        winner = matchData2.player_one_id;
      } else if (playerTwoWins > playerOneWins) {
        winner = matchData2.player_two_id;
      }
    }

    const updatedMatch: Match = {
      id: matchData2.id,
      tournamentId: matchData2.tournament_id,
      playerOneId: matchData2.player_one_id,
      playerTwoId: matchData2.player_two_id,
      scores,
      winner,
      scheduledTime: new Date(matchData2.scheduled_time),
      status: matchData2.status as 'scheduled' | 'completed' | 'cancelled',
      location: matchData2.location
    };
    
    setMatches(prev => prev.map(m => m.id === id ? updatedMatch : m));
    return updatedMatch;
  };

  return { updateMatch };
};
