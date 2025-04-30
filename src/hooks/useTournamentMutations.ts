
import { Tournament, TournamentFormat } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useTournamentMutations = (setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>) => {
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
      format: data.format as TournamentFormat, // Cast to ensure proper typing
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      location: data.location,
      entryFee: Number(data.entry_fee),
      maxParticipants: data.max_participants,
      registeredParticipants: [],
      createdBy: data.created_by,
      bannerImage: data.banner_image,
      status: data.status as 'upcoming' | 'ongoing' | 'completed', // Cast to ensure proper typing
      pixKey: data.pix_key
    };
    
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    const updateData: {
      name?: string;
      description?: string;
      format?: TournamentFormat;
      start_date?: string;
      end_date?: string;
      location?: string;
      entry_fee?: number;
      max_participants?: number;
      banner_image?: string;
      status?: 'upcoming' | 'ongoing' | 'completed';
      pix_key?: string;
      updated_at?: string;
    } = {};

    
    
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
    
    if (error) throw error;
    if (!updatedData) throw new Error('No data returned from update');

    // Update participants if necessary
    if (data.registeredParticipants) {
      // Get current participants
      const { data: currentParticipants } = await supabase
        .from('tournament_participants')
        .select('athlete_id')
        .eq('tournament_id', id);
      
      const currentParticipantIds = currentParticipants?.map(p => p.athlete_id) || [];
      const newParticipantIds = data.registeredParticipants;
      
      // Add new participants
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

      // Remove participants not in the list
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

    const tournament: Tournament = {
      id: updatedData.id,
      name: updatedData.name,
      description: updatedData.description,
      format: updatedData.format as TournamentFormat, // Cast to ensure proper typing
      startDate: new Date(updatedData.start_date),
      endDate: new Date(updatedData.end_date),
      location: updatedData.location,
      entryFee: Number(updatedData.entry_fee),
      maxParticipants: updatedData.max_participants,
      registeredParticipants: data.registeredParticipants || [], // Use provided participants or empty array
      createdBy: updatedData.created_by,
      bannerImage: updatedData.banner_image,
      status: updatedData.status as 'upcoming' | 'ongoing' | 'completed', // Cast to ensure proper typing
      pixKey: updatedData.pix_key
    };
    
    setTournaments(prev => prev.map(t => t.id === id ? tournament : t));
    return tournament;
  };

  const deleteTournament = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  return {
    createTournament,
    updateTournament,
    deleteTournament
  };
};
