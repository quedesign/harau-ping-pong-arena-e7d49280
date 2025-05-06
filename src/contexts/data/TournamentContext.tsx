
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tournament } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useTournamentMutations } from '@/hooks/useTournamentMutations';

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
  isLoading?: boolean;
}

const useProvideTournament = (): TournamentContextType => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllTournaments = useCallback(async (): Promise<Tournament[]> => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*');
      
      if (error) throw error;

      if (!data) return [];
      
      const tournamentsArray = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        format: item.format as any,
        startDate: new Date(item.start_date),
        endDate: new Date(item.end_date),
        location: item.location,
        entryFee: item.entry_fee,
        maxParticipants: item.max_participants,
        registeredParticipants: [],
        createdBy: item.created_by,
        bannerImage: item.banner_image,
        status: item.status as 'upcoming' | 'ongoing' | 'completed',
        pixKey: item.pix_key,
      }));
      
      return tournamentsArray;
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      throw err;
    }
  }, []);

  const fetchTournament = useCallback(async (id: string): Promise<Tournament | undefined> => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) return undefined;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        format: data.format as any,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        location: data.location,
        entryFee: data.entry_fee,
        maxParticipants: data.max_participants,
        registeredParticipants: [],
        createdBy: data.created_by,
        bannerImage: data.banner_image,
        status: data.status as 'upcoming' | 'ongoing' | 'completed',
        pixKey: data.pix_key,
      };
    } catch (err) {
      console.error("Error fetching tournament:", err);
      throw err;
    }
  }, []);

  // Use the imported hook
  const { editTournament, deleteTournament: deleteT } = useTournamentMutations();

  const createTournament = async (tournamentData: Omit<Tournament, 'id'>): Promise<Tournament> => {
    // Implementation
    // This is a mock implementation
    const newTournament = { id: Date.now().toString(), ...tournamentData };
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    await editTournament(id, data);
    const updatedTournament = await fetchTournament(id);
    if (!updatedTournament) {
      throw new Error('Failed to fetch updated tournament');
    }
    return updatedTournament;
  };

  const deleteTournament = async (id: string): Promise<void> => {
    await deleteT(id);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {      
      const allTournaments = await fetchAllTournaments()
      setTournaments(allTournaments);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchAllTournaments]);

  const fetchSingleTournament = useCallback(async (id: string) => {
    try {
      if (!id) return;
      
      const tournamentData = await fetchTournament(id)
      if(tournamentData){
        setTournament(tournamentData)
      } else {
        throw new Error('Error getting tournament');
      }
      
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [fetchTournament]);

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
    isLoading: loading,
  };
};

// Creating the context
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

// Access hook
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
