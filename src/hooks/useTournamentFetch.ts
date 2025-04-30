
import { useState, useEffect } from 'react';
import { Tournament, TournamentFormat } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

// Single tournament fetch
export const useTournamentFetch = (tournamentId?: string) => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (tournamentId) {
        await fetchSingleTournament(tournamentId);
      } else {
        await fetchTournaments();
      }
    }
    fetchData();  }, [tournamentId]);
  const fetchSingleTournament = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }

      if (data) {
        const formattedTournament: Tournament = {
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

        // Load participants
        const { data: participants } = await supabase
          .from('tournament_participants')
          .select('athlete_id')
          .eq('tournament_id', id)
          .eq('approved', true);
        
        if (participants) {
          formattedTournament.registeredParticipants = participants.map(p => p.athlete_id);
        }

        setTournament(formattedTournament);
      }
    } catch (err) {
      if (err && (err as any).error) {
        console.error('Error fetching tournament:', (err as any).error.message, (err as any).error.details);
        setError((err as any).error);
      } else if (err instanceof Error) {
        console.error('Error fetching tournament:', err.message);
        setError(err);
      } else {
        console.error('Error fetching tournament:', JSON.stringify(err, null, 2));
        setError(new Error(JSON.stringify(err)));
      }
      toast({
        title: t('common.error'),
        description: t('tournaments.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    } catch (err) {
      if (err && (err as any).error) {
        console.error('Error fetching tournaments:', (err as any).error.message, (err as any).error.details);
        setError((err as any).error);
      } else if (err instanceof Error) {
        console.error('Error fetching tournaments:', err.message);
        setError(err);
      } else {
        console.error('Error fetching tournaments:', JSON.stringify(err, null, 2));
        setError(new Error(JSON.stringify(err)));
      }
      toast({
        title: t('common.error'),
        description: t('tournaments.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Return proper values based on whether we're fetching a single tournament or multiple
  return tournamentId 
    ? { tournament, isLoading, error }
    : { tournaments, setTournaments, loading };
};
