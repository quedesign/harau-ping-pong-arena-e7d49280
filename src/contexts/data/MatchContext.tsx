import React, { createContext, useContext } from 'react';
import { Match, Bracket, Tournament, TournamentFormat } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { useAthlete } from './AthleteContext';

interface MatchContextType {
  matches: Match[];
  loading: boolean;
  createMatch: (match: Omit<Match, 'id'>) => Promise<Match>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<Match>;
  generateBracket: (tournamentId: string, seeds?: string[]) => Promise<Bracket>;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { athleteProfiles } = useAthlete();
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
      
      if (error) {
        throw error;
      }

      if (data) {
        const formattedMatches: Match[] = data.map(item => {
          // Processar os scores
          const scores = {
            playerOne: [] as number[],
            playerTwo: [] as number[]
          };

          // Se match_scores é um array (pode ser nulo)
          if (Array.isArray(item.match_scores)) {
            item.match_scores.sort((a, b) => a.set_number - b.set_number);
            
            item.match_scores.forEach(score => {
              scores.playerOne.push(score.player_one_score);
              scores.playerTwo.push(score.player_two_score);
            });
          }

          // Determinar o vencedor
          let winner: string | undefined;
          if (item.status === 'completed') {
            // Contar quantos sets cada jogador ganhou
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
      console.error('Erro ao buscar partidas:', error);
      toast({
        title: t('common.error'),
        description: t('matches.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (matchData: Omit<Match, 'id'>): Promise<Match> => {
    const { scheduledTime, scores, ...rest } = matchData;
    
    // Preparar os dados para o Supabase
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
    
    if (error) {
      console.error('Erro ao criar partida:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from create');
    }

    // Se houver scores, inserir também
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

    // Converter de volta ao formato do app
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
    
    // Atualizar o estado local
    setMatches(prev => [...prev, newMatch]);
    
    return newMatch;
  };

  const updateMatch = async (id: string, matchData: Partial<Match>): Promise<Match> => {
    // Primeiro, atualizar os dados básicos da partida
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (matchData.tournamentId) updateData.tournament_id = matchData.tournamentId;
    if (matchData.playerOneId) updateData.player_one_id = matchData.playerOneId;
    if (matchData.playerTwoId) updateData.player_two_id = matchData.playerTwoId;
    if (matchData.scheduledTime) updateData.scheduled_time = matchData.scheduledTime.toISOString();
    if (matchData.status) updateData.status = matchData.status;
    if (matchData.location !== undefined) updateData.location = matchData.location;
    
    // Se houver dados da partida para atualizar
    if (Object.keys(updateData).length > 1) {  // > 1 porque já temos updated_at
      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar partida:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from update');
      }
    }

    // Agora, se temos scores para atualizar
    if (matchData.scores) {
      // Primeiro, excluir os scores existentes
      await supabase
        .from('match_scores')
        .delete()
        .eq('match_id', id);
      
      // Inserir os novos scores
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

    // Buscar os dados completos da partida atualizada
    const { data: matchData2, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        match_scores(*)
      `)
      .eq('id', id)
      .single();
    
    if (matchError) {
      console.error('Erro ao buscar partida atualizada:', matchError);
      throw matchError;
    }

    if (!matchData2) {
      throw new Error('No data returned from fetch');
    }

    // Processar os scores
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

    // Determinar o vencedor
    let winner: string | undefined = matchData.winner;
    if (matchData.status === 'completed' && !winner) {
      // Contar quantos sets cada jogador ganhou
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

    // Converter para o formato do app
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
    
    // Atualizar o estado local
    setMatches(prev => prev.map(m => m.id === id ? updatedMatch : m));
    
    // Atualizar estatísticas se a partida foi concluída e tem um vencedor
    // if (updatedMatch.status === 'completed' && updatedMatch.winner && 
    //   (matchData.status === 'completed' || matchData.scores)) {
    //   await updateAthleteStats(updatedMatch);
    // }
    
    return updatedMatch;
  };

  const generateBracket = async (tournamentId: string, seeds?: string[]): Promise<Bracket> => {
    // Buscar o torneio
    // const tournament = tournaments.find(t => t.id === tournamentId);
    // if (!tournament) {
    //   throw new Error('Tournament not found');
    // }
    
    // // Get registered participants
    // const participants = tournament.registeredParticipants;
    
    // // Generate seeds if not provided
    // const generatedSeeds = seeds || [...participants].sort(() => Math.random() - 0.5);
    
    // // Create a new bracket
    // const bracket: Bracket = {
    //   tournamentId,
    //   rounds: [],
    //   seeds: generatedSeeds.map((athleteId, index) => ({
    //     position: index + 1,
    //     athleteId
    //   }))
    // };
    
    // // For knockout tournaments, create the initial round matches
    // if (tournament.format === 'knockout') {
    //   const firstRoundMatches: Match[] = [];
      
    //   // Pair athletes for first round
    //   for (let i = 0; i < generatedSeeds.length; i += 2) {
    //     if (i + 1 < generatedSeeds.length) {
    //       const newMatch = await createMatch({
    //         tournamentId,
    //         playerOneId: generatedSeeds[i],
    //         playerTwoId: generatedSeeds[i + 1],
    //         scores: {
    //           playerOne: [],
    //           playerTwo: []
    //         },
    //         scheduledTime: new Date(tournament.startDate),
    //         status: 'scheduled',
    //         location: tournament.location
    //       });
          
    //       firstRoundMatches.push(newMatch);
    //     }
    //   }
      
    //   bracket.rounds.push({
    //     roundNumber: 1,
    //     matches: firstRoundMatches
    //   });
    // }
    
    // // For round-robin, create matches where each player plays against all others
    // if (tournament.format === 'round-robin') {
    //   const roundRobinMatches: Match[] = [];
      
    //   for (let i = 0; i < generatedSeeds.length; i++) {
    //     for (let j = i + 1; j < generatedSeeds.length; j++) {
    //       const newMatch = await createMatch({
    //         tournamentId,
    //         playerOneId: generatedSeeds[i],
    //         playerTwoId: generatedSeeds[j],
    //         scores: {
    //           playerOne: [],
    //           playerTwo: []
    //         },
    //         scheduledTime: new Date(tournament.startDate),
    //         status: 'scheduled',
    //         location: tournament.location
    //       });
          
    //       roundRobinMatches.push(newMatch);
    //     }
    //   }
      
    //   bracket.rounds.push({
    //     roundNumber: 1,
    //     matches: roundRobinMatches
    //   });
    // }
    
    return {} as any;
  };

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
