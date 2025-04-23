
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tournament, AthleteProfile, Match, TournamentFormat, Bracket, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface DataContextType {
  tournaments: Tournament[];
  athleteProfiles: AthleteProfile[];
  matches: Match[];
  loading: {
    tournaments: boolean;
    athletes: boolean;
    matches: boolean;
  };
  // Tournament functions
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
  // Athlete profile functions
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, data: Partial<AthleteProfile>) => Promise<AthleteProfile>;
  // Match functions
  createMatch: (match: Omit<Match, 'id'>) => Promise<Match>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<Match>;
  // Tournament bracket functions
  generateBracket: (tournamentId: string, seeds?: string[]) => Promise<Bracket>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [athleteProfiles, setAthleteProfiles] = useState<AthleteProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  const [loading, setLoading] = useState({
    tournaments: true,
    athletes: true,
    matches: true
  });

  // Carregar os dados quando o usuário estiver autenticado
  useEffect(() => {
    if (currentUser) {
      fetchTournaments();
      fetchAthleteProfiles();
      fetchMatches();
    }
  }, [currentUser]);

  // Buscar torneios
  const fetchTournaments = async () => {
    setLoading(prev => ({ ...prev, tournaments: true }));
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) {
        throw error;
      }

      if (data) {
        const formattedTournaments: Tournament[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          format: item.format as TournamentFormat,
          startDate: new Date(item.start_date),
          endDate: new Date(item.end_date),
          location: item.location,
          entryFee: Number(item.entry_fee),
          maxParticipants: item.max_participants,
          registeredParticipants: [], // Será preenchido abaixo
          createdBy: item.created_by,
          bannerImage: item.banner_image,
          status: item.status as 'upcoming' | 'ongoing' | 'completed',
          pixKey: item.pix_key
        }));

        // Carregar os participantes para cada torneio
        for (const tournament of formattedTournaments) {
          const { data: participants } = await supabase
            .from('tournament_participants')
            .select('athlete_id')
            .eq('tournament_id', tournament.id)
            .eq('approved', true);
          
          if (participants) {
            tournament.registeredParticipants = participants.map(p => p.athlete_id);
          }
        }

        setTournaments(formattedTournaments);
      }
    } catch (error) {
      console.error('Erro ao buscar torneios:', error);
      toast({
        title: t('common.error'),
        description: t('tournaments.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, tournaments: false }));
    }
  };

  // Buscar perfis de atletas
  const fetchAthleteProfiles = async () => {
    setLoading(prev => ({ ...prev, athletes: true }));
    try {
      // Primeira, buscar perfis básicos
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'athlete');
      
      if (profilesError) {
        throw profilesError;
      }

      if (profilesData) {
        const profiles: User[] = profilesData.map(p => ({
          id: p.id,
          name: p.name,
          email: p.email,
          role: p.role as 'athlete' | 'admin',
          profileImage: p.profile_image,
          createdAt: new Date(p.created_at)
        }));

        // Agora buscar detalhes dos atletas
        const { data: athleteData, error: athleteError } = await supabase
          .from('athlete_profiles')
          .select('*');
        
        if (athleteError) {
          throw athleteError;
        }

        if (athleteData) {
          const formattedProfiles: AthleteProfile[] = athleteData.map(athlete => {
            const profile = profiles.find(p => p.id === athlete.user_id);
            
            return {
              userId: athlete.user_id,
              handedness: athlete.handedness as 'left' | 'right' | 'ambidextrous',
              height: Number(athlete.height) || undefined,
              weight: Number(athlete.weight) || undefined,
              level: athlete.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
              location: {
                city: athlete.city,
                state: athlete.state,
                country: athlete.country,
              },
              bio: athlete.bio || undefined,
              yearsPlaying: athlete.years_playing || undefined,
              wins: athlete.wins,
              losses: athlete.losses
            };
          });

          setAthleteProfiles(formattedProfiles);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar perfis de atletas:', error);
      toast({
        title: t('common.error'),
        description: t('athletes.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, athletes: false }));
    }
  };

  // Buscar partidas
  const fetchMatches = async () => {
    setLoading(prev => ({ ...prev, matches: true }));
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
      setLoading(prev => ({ ...prev, matches: false }));
    }
  };

  // Tournament functions
  const createTournament = async (tournamentData: Omit<Tournament, 'id'>): Promise<Tournament> => {
    if (!currentUser) {
      throw new Error('User must be logged in');
    }

    const { startDate, endDate, registeredParticipants, ...rest } = tournamentData;
    
    // Preparar os dados para o Supabase
    const supabaseTournament = {
      name: rest.name,
      description: rest.description,
      format: rest.format,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      location: rest.location,
      entry_fee: rest.entryFee,
      max_participants: rest.maxParticipants,
      created_by: currentUser.id,
      status: rest.status,
      banner_image: rest.bannerImage,
      pix_key: rest.pixKey
    };
    
    const { data, error } = await supabase
      .from('tournaments')
      .insert(supabaseTournament)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar torneio:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from create');
    }
    
    // Converter de volta ao formato do app
    const newTournament: Tournament = {
      id: data.id,
      name: data.name,
      description: data.description,
      format: data.format as TournamentFormat,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      location: data.location,
      entryFee: Number(data.entry_fee),
      maxParticipants: data.max_participants,
      registeredParticipants: [],
      createdBy: data.created_by,
      bannerImage: data.banner_image,
      status: data.status as 'upcoming' | 'ongoing' | 'completed',
      pixKey: data.pix_key
    };
    
    // Atualizar o estado local
    setTournaments(prev => [...prev, newTournament]);
    
    return newTournament;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    // Converter os dados para o formato do Supabase
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.format) updateData.format = data.format;
    if (data.startDate) updateData.start_date = data.startDate.toISOString();
    if (data.endDate) updateData.end_date = data.endDate.toISOString();
    if (data.location) updateData.location = data.location;
    if (data.entryFee !== undefined) updateData.entry_fee = data.entryFee;
    if (data.maxParticipants) updateData.max_participants = data.maxParticipants;
    if (data.bannerImage !== undefined) updateData.banner_image = data.bannerImage;
    if (data.status) updateData.status = data.status;
    if (data.pixKey !== undefined) updateData.pix_key = data.pixKey;
    updateData.updated_at = new Date().toISOString();
    
    const { data: updatedData, error } = await supabase
      .from('tournaments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar torneio:', error);
      throw error;
    }

    if (!updatedData) {
      throw new Error('No data returned from update');
    }

    // Atualizar participantes se necessário
    if (data.registeredParticipants) {
      // Buscar os participantes atuais
      const { data: currentParticipants } = await supabase
        .from('tournament_participants')
        .select('athlete_id')
        .eq('tournament_id', id);
      
      const currentParticipantIds = currentParticipants?.map(p => p.athlete_id) || [];
      const newParticipantIds = data.registeredParticipants;
      
      // Adicionar novos participantes
      const participantsToAdd = newParticipantIds.filter(
        id => !currentParticipantIds.includes(id)
      );

      if (participantsToAdd.length > 0) {
        const participantsData = participantsToAdd.map(athleteId => ({
          tournament_id: id,
          athlete_id: athleteId,
          approved: true
        }));

        await supabase
          .from('tournament_participants')
          .insert(participantsData);
      }

      // Remover participantes que não estão mais na lista
      const participantsToRemove = currentParticipantIds.filter(
        id => !newParticipantIds.includes(id)
      );

      if (participantsToRemove.length > 0) {
        await supabase
          .from('tournament_participants')
          .delete()
          .eq('tournament_id', id)
          .in('athlete_id', participantsToRemove);
      }
    }

    // Converter de volta para o formato do app
    const tournament: Tournament = {
      id: updatedData.id,
      name: updatedData.name,
      description: updatedData.description,
      format: updatedData.format as TournamentFormat,
      startDate: new Date(updatedData.start_date),
      endDate: new Date(updatedData.end_date),
      location: updatedData.location,
      entryFee: Number(updatedData.entry_fee),
      maxParticipants: updatedData.max_participants,
      registeredParticipants: data.registeredParticipants || tournaments.find(t => t.id === id)?.registeredParticipants || [],
      createdBy: updatedData.created_by,
      bannerImage: updatedData.banner_image,
      status: updatedData.status as 'upcoming' | 'ongoing' | 'completed',
      pixKey: updatedData.pix_key
    };
    
    // Atualizar o estado local
    setTournaments(prev => prev.map(t => t.id === id ? tournament : t));
    
    return tournament;
  };

  const deleteTournament = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir torneio:', error);
      throw error;
    }
    
    // Atualizar o estado local
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  // Athlete profile functions
  const getAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
    try {
      // Primeiro verificar se já temos no estado
      const cachedProfile = athleteProfiles.find(p => p.userId === userId);
      if (cachedProfile) return cachedProfile;
      
      // Buscar no Supabase
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Não encontrado
          return undefined;
        }
        throw error;
      }

      if (data) {
        const profile: AthleteProfile = {
          userId: data.user_id,
          handedness: data.handedness as 'left' | 'right' | 'ambidextrous',
          height: Number(data.height) || undefined,
          weight: Number(data.weight) || undefined,
          level: data.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
          location: {
            city: data.city,
            state: data.state,
            country: data.country,
          },
          bio: data.bio || undefined,
          yearsPlaying: data.years_playing || undefined,
          wins: data.wins,
          losses: data.losses
        };

        // Adicionar ao estado local
        setAthleteProfiles(prev => [...prev, profile]);
        return profile;
      }
    } catch (error) {
      console.error('Erro ao buscar perfil de atleta:', error);
      return undefined;
    }
  };

  const createAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
    const { location, ...rest } = profile;
    
    // Preparar os dados para o Supabase
    const athleteData = {
      user_id: rest.userId,
      handedness: rest.handedness,
      height: rest.height,
      weight: rest.weight,
      level: rest.level,
      city: location.city,
      state: location.state,
      country: location.country,
      bio: rest.bio,
      years_playing: rest.yearsPlaying,
      wins: rest.wins,
      losses: rest.losses
    };
    
    const { data, error } = await supabase
      .from('athlete_profiles')
      .insert(athleteData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar perfil de atleta:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from create');
    }

    // Converter de volta ao formato do app
    const newProfile: AthleteProfile = {
      userId: data.user_id,
      handedness: data.handedness as 'left' | 'right' | 'ambidextrous',
      height: Number(data.height) || undefined,
      weight: Number(data.weight) || undefined,
      level: data.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
      location: {
        city: data.city,
        state: data.state,
        country: data.country,
      },
      bio: data.bio || undefined,
      yearsPlaying: data.years_playing || undefined,
      wins: data.wins,
      losses: data.losses
    };
    
    // Atualizar o estado local
    setAthleteProfiles(prev => [...prev, newProfile]);
    
    return newProfile;
  };

  const updateAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
    // Preparar os dados para o Supabase
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (profileData.handedness) updateData.handedness = profileData.handedness;
    if (profileData.height !== undefined) updateData.height = profileData.height;
    if (profileData.weight !== undefined) updateData.weight = profileData.weight;
    if (profileData.level) updateData.level = profileData.level;
    if (profileData.bio !== undefined) updateData.bio = profileData.bio;
    if (profileData.yearsPlaying !== undefined) updateData.years_playing = profileData.yearsPlaying;
    if (profileData.wins !== undefined) updateData.wins = profileData.wins;
    if (profileData.losses !== undefined) updateData.losses = profileData.losses;
    
    if (profileData.location) {
      if (profileData.location.city) updateData.city = profileData.location.city;
      if (profileData.location.state) updateData.state = profileData.location.state;
      if (profileData.location.country) updateData.country = profileData.location.country;
    }
    
    const { data: updatedData, error } = await supabase
      .from('athlete_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar perfil de atleta:', error);
      throw error;
    }

    if (!updatedData) {
      throw new Error('No data returned from update');
    }

    // Converter de volta ao formato do app
    const profile: AthleteProfile = {
      userId: updatedData.user_id,
      handedness: updatedData.handedness as 'left' | 'right' | 'ambidextrous',
      height: Number(updatedData.height) || undefined,
      weight: Number(updatedData.weight) || undefined,
      level: updatedData.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
      location: {
        city: updatedData.city,
        state: updatedData.state,
        country: updatedData.country,
      },
      bio: updatedData.bio || undefined,
      yearsPlaying: updatedData.years_playing || undefined,
      wins: updatedData.wins,
      losses: updatedData.losses
    };
    
    // Atualizar o estado local
    setAthleteProfiles(prev => prev.map(p => p.userId === userId ? profile : p));
    
    return profile;
  };

  // Match functions
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
    if (updatedMatch.status === 'completed' && updatedMatch.winner && 
      (matchData.status === 'completed' || matchData.scores)) {
      await updateAthleteStats(updatedMatch);
    }
    
    return updatedMatch;
  };

  // Função auxiliar para atualizar estatísticas dos atletas após uma partida
  const updateAthleteStats = async (match: Match) => {
    if (!match.winner) return;
    
    const winnerId = match.winner;
    const loserId = match.playerOneId === winnerId ? match.playerTwoId : match.playerOneId;
    
    // Atualizar vencedor
    try {
      const { data: winnerData } = await supabase
        .from('athlete_profiles')
        .select('wins')
        .eq('user_id', winnerId)
        .single();
      
      if (winnerData) {
        await supabase
          .from('athlete_profiles')
          .update({ wins: winnerData.wins + 1 })
          .eq('user_id', winnerId);
      }
    } catch (error) {
      console.error('Erro ao atualizar estatísticas do vencedor:', error);
    }
    
    // Atualizar perdedor
    try {
      const { data: loserData } = await supabase
        .from('athlete_profiles')
        .select('losses')
        .eq('user_id', loserId)
        .single();
      
      if (loserData) {
        await supabase
          .from('athlete_profiles')
          .update({ losses: loserData.losses + 1 })
          .eq('user_id', loserId);
      }
    } catch (error) {
      console.error('Erro ao atualizar estatísticas do perdedor:', error);
    }
    
    // Atualizar o estado local também
    setAthleteProfiles(prev => prev.map(profile => {
      if (profile.userId === winnerId) {
        return {
          ...profile,
          wins: profile.wins + 1
        };
      } else if (profile.userId === loserId) {
        return {
          ...profile,
          losses: profile.losses + 1
        };
      }
      return profile;
    }));
  };

  // Tournament bracket functions
  const generateBracket = async (tournamentId: string, seeds?: string[]): Promise<Bracket> => {
    // Buscar o torneio
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    
    // Get registered participants
    const participants = tournament.registeredParticipants;
    
    // Generate seeds if not provided
    const generatedSeeds = seeds || [...participants].sort(() => Math.random() - 0.5);
    
    // Create a new bracket
    const bracket: Bracket = {
      tournamentId,
      rounds: [],
      seeds: generatedSeeds.map((athleteId, index) => ({
        position: index + 1,
        athleteId
      }))
    };
    
    // For knockout tournaments, create the initial round matches
    if (tournament.format === 'knockout') {
      const firstRoundMatches: Match[] = [];
      
      // Pair athletes for first round
      for (let i = 0; i < generatedSeeds.length; i += 2) {
        if (i + 1 < generatedSeeds.length) {
          const newMatch = await createMatch({
            tournamentId,
            playerOneId: generatedSeeds[i],
            playerTwoId: generatedSeeds[i + 1],
            scores: {
              playerOne: [],
              playerTwo: []
            },
            scheduledTime: new Date(tournament.startDate),
            status: 'scheduled',
            location: tournament.location
          });
          
          firstRoundMatches.push(newMatch);
        }
      }
      
      bracket.rounds.push({
        roundNumber: 1,
        matches: firstRoundMatches
      });
    }
    
    // For round-robin, create matches where each player plays against all others
    if (tournament.format === 'round-robin') {
      const roundRobinMatches: Match[] = [];
      
      for (let i = 0; i < generatedSeeds.length; i++) {
        for (let j = i + 1; j < generatedSeeds.length; j++) {
          const newMatch = await createMatch({
            tournamentId,
            playerOneId: generatedSeeds[i],
            playerTwoId: generatedSeeds[j],
            scores: {
              playerOne: [],
              playerTwo: []
            },
            scheduledTime: new Date(tournament.startDate),
            status: 'scheduled',
            location: tournament.location
          });
          
          roundRobinMatches.push(newMatch);
        }
      }
      
      bracket.rounds.push({
        roundNumber: 1,
        matches: roundRobinMatches
      });
    }
    
    return bracket;
  };

  const value = {
    tournaments,
    athleteProfiles,
    matches,
    loading,
    createTournament,
    updateTournament,
    deleteTournament,
    getAthleteProfile,
    createAthleteProfile,
    updateAthleteProfile,
    createMatch,
    updateMatch,
    generateBracket
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
