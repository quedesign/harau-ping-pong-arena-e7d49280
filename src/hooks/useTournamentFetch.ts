
import { useState, useEffect, useCallback } from 'react';
import { Tournament, TournamentFormat } from '@/types';
import { readData } from '@/integrations/firebase/utils';
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

  const fetchData = useCallback(async () => {
    if (tournamentId) {
      await fetchSingleTournamentFromFirebase(tournamentId);
    } else {
      await fetchTournamentsFromFirebase();
    }
  }, [tournamentId]);

  const reload = useCallback(() => {
    fetchData();
  },[fetchData])

  useEffect(() => {    
    fetchData();
    return () => {
      if (tournamentId){
        setTournament(null)
      }else{
        setTournaments([])
      }
    }
  }, [fetchData, tournamentId]);

  const fetchSingleTournamentFromFirebase = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await readData(`tournaments/${id}`);

      if (data) {
        const formattedTournament: Tournament = {
          id: data.id,
          name: data.name,
          registeredParticipants: [],
          bannerImage: data.bannerImage,
          createdBy: data.createdBy,
          description: data.description,
          format: data.format as TournamentFormat,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          location: data.location,
          entryFee: Number(data.entry_fee),
          maxParticipants: data.max_participants,
          status: data.status as 'upcoming' | 'ongoing' | 'completed',
          pixKey: data.pix_key,
        };
        
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

  const fetchTournamentsFromFirebase = async () => {
    setLoading(true);
    try {
      const data = await readData('tournaments');

      if (!data) {
        throw new Error('No data returned from fetchTournaments');
      }
      const tournamentArray = Object.entries(data).map(([id, item]) => ({
        id,
        name: item.name,
        description: item.description,
        format: item.format as TournamentFormat,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        location: item.location,
        entryFee: Number(item.entryFee),
        maxParticipants: item.maxParticipants,
        registeredParticipants: [],
        createdBy: item.createdBy,
        bannerImage: item.bannerImage,
        status: item.status as 'upcoming' | 'ongoing' | 'completed',
        pixKey: item.pixKey,
      })) as Tournament[];
      setTournaments(tournamentArray);
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : JSON.stringify(err);
      setError(new Error(errorMessage));
      toast({
        title: t('common.error'),
        description: t(tournamentId ? 'tournaments.fetchError' : 'tournaments.fetchAllError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);      
    }
  };

  // Return proper values based on whether we're fetching a single tournament or multiple
  return tournamentId 
  ? { tournament, isLoading, error }
    : { tournaments, setTournaments, loading, error, reload };
};
