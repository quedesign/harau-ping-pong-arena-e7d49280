import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tournament, TournamentFormat } from '@/types';
import { useTournamentMutations } from '@/hooks/useTournamentMutations';
import { supabase } from '@/integrations/supabase/client';

interface TournamentContextType {
  tournaments: Tournament[];
  tournament: Tournament | null;
  loading: boolean;
  error: Error | null;
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
  fetchSingleTournament: (id: string) => Promise<void>;
  reload: () => void;
}

const useProvideTournament = (): TournamentContextType => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { createTournament, updateTournament, deleteTournament } = useTournamentMutations(setTournaments);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          format: item.format as TournamentFormat,
          startDate: new Date(item.start_date),
          endDate: new Date(item.end_date),
          location: item.location,
          entryFee: Number(item.entry_fee),
          maxParticipants: item.max_participants,
          registeredParticipants: [], // precisa ser carregado separadamente se necessário
          createdBy: item.created_by,
          bannerImage: item.banner_image,
          status: item.status as 'upcoming' | 'ongoing' | 'completed',
          pixKey: item.pix_key,
        }));

        setTournaments(mapped);
        setError(null);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleTournament = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) throw new Error('Error getting tournament');

      setTournament({
        id: data.id,
        name: data.name,
        description: data.description,
        format: data.format as TournamentFormat,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        location: data.location,
        entryFee: Number(data.entry_fee),
        maxParticipants: data.max_participants,
        registeredParticipants: [], // idem
        createdBy: data.created_by,
        bannerImage: data.banner_image,
        status: data.status as 'upcoming' | 'ongoing' | 'completed',
        pixKey: data.pix_key,
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  const reload = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    tournaments,
    tournament,
    loading,
    error,
    createTournament,
    updateTournament,
    deleteTournament,
    fetchSingleTournament,
    reload,
  };
};

// Criação do contexto
const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

// Provider
export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useProvideTournament();

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

// Hook de acesso
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};