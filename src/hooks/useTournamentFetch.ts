
import { useState, useEffect } from 'react';
import { Tournament, TournamentFormat } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

export const useTournamentFetch = () => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return { tournaments, setTournaments, loading };
};
