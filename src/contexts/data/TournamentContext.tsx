import React, { createContext, useContext } from 'react';
import { Tournament, TournamentFormat } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

interface TournamentContextType {
  tournaments: Tournament[];
  loading: boolean;
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = React.useState<Tournament[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;

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
          registeredParticipants: [], // Will be populated below
          createdBy: item.created_by,
          bannerImage: item.banner_image,
          status: item.status as 'upcoming' | 'ongoing' | 'completed',
          pixKey: item.pix_key
        }));

        // Load participants for each tournament
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
      console.error('Error fetching tournaments:', error);
      toast({
        title: t('common.error'),
        description: t('tournaments.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTournament = async (tournamentData: Omit<Tournament, 'id'>): Promise<Tournament> => {
    const { startDate, endDate, registeredParticipants, ...rest } = tournamentData;
    
    const supabaseTournament = {
      name: rest.name,
      description: rest.description,
      format: rest.format,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      location: rest.location,
      entry_fee: rest.entryFee,
      max_participants: rest.maxParticipants,
      created_by: rest.createdBy,
      status: rest.status,
      banner_image: rest.bannerImage,
      pix_key: rest.pixKey
    };
    
    const { data, error } = await supabase
      .from('tournaments')
      .insert(supabaseTournament)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from create');
    
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

  const value = {
    tournaments,
    loading,
    createTournament,
    updateTournament,
    deleteTournament
  };

  return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
