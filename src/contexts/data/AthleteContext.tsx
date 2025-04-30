import React, { createContext, useContext, useCallback } from 'react';
import { AthleteProfile, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { SupabaseAthleteData, formatSupabaseAthleteProfile } from './athlete/mappers';

interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, data: Partial<AthleteProfile>) => Promise<AthleteProfile>;
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);





export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [athleteProfiles, setAthleteProfiles] = React.useState<AthleteProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  
  const fetchAthleteProfiles = useCallback(async () => {
    
    
    setLoading(true);
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
          const formattedProfiles = athleteData.map(athlete => {
            const profile = profiles.find(p => p.id === athlete.user_id);
            const data = athlete as SupabaseAthleteData;
            return formatSupabaseAthleteProfile(data);
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
      setLoading(false);
    }
  }, [setAthleteProfiles, t]);

    React.useEffect(() => {
      fetchAthleteProfiles();
    }, [fetchAthleteProfiles]);


  const getAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
    try {
      // First check if we already have it in state
      const cachedProfile = athleteProfiles.find(p => p.userId === userId);
      if (cachedProfile) return cachedProfile;
      
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return undefined;
        }
        throw error;
      }

      if (data) {
        // Handle data from Supabase with potential missing fields
        const athlete = data as SupabaseAthleteData;
        const profile = formatSupabaseAthleteProfile(athlete);

        // Add to local state
        setAthleteProfiles(prev => [...prev, profile]);
        return profile;
      }
    } catch (error) {
      console.error('Erro ao buscar perfil de atleta:', error);
      return undefined;
    }
  };

  const createAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
    const { location, equipment, ...rest } = profile;
    
    // Prepare data for Supabase
    const athleteData = {
     user_id: rest.userId,
      handedness: rest.handedness || null,
      height: rest.height || null,
      weight: rest.weight || null,
      level: rest.level || null,
      city: location.city,
      state: location.state,
      country: location.country,
      bio: rest.bio,
      years_playing: rest.yearsPlaying,
      wins: rest.wins,
      losses: rest.losses,
      // New fields
      playing_style: rest.playingStyle,
      grip_style: rest.gripStyle,
      play_frequency: rest.playFrequency,
      tournament_participation: rest.tournamentParticipation,
      club: rest.club,
      available_times: rest.availableTimes,
      preferred_locations: rest.preferredLocations,
      racket: equipment?.racket,
      rubbers: equipment?.rubbers
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

    // Convert back to app format
    const newProfile = formatSupabaseAthleteProfile(data)
    // Update local state
    setAthleteProfiles(prev => [...prev, newProfile]);
    
    return newProfile;
  };

  const updateAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
    // Prepare data for Supabase
    const updateData: Partial<SupabaseAthleteData> = { updated_at: new Date().toISOString() };
    
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

    // New fields
    if (profileData.playingStyle) updateData.playing_style = profileData.playingStyle;
    if (profileData.gripStyle) updateData.grip_style = profileData.gripStyle;
    if (profileData.playFrequency) updateData.play_frequency = profileData.playFrequency;
    if (profileData.tournamentParticipation) updateData.tournament_participation = profileData.tournamentParticipation;
    if (profileData.club !== undefined) updateData.club = profileData.club;
    if (profileData.availableTimes !== undefined) updateData.available_times = profileData.availableTimes;
    if (profileData.preferredLocations !== undefined) updateData.preferred_locations = profileData.preferredLocations;
    
    if (profileData.equipment) {
      if (profileData.equipment.racket !== undefined) updateData.racket = profileData.equipment.racket;
      if (profileData.equipment.rubbers !== undefined) updateData.rubbers = profileData.equipment.rubbers;
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

    // Convert back to app format
    const athlete = updatedData as SupabaseAthleteData;
    const profile = formatSupabaseAthleteProfile(athlete);
    
    // Update local state
    setAthleteProfiles(prev => prev.map(p => p.userId === userId ? profile : p));
    
    return profile;
  };

  const value = {
    athleteProfiles,
    getAthleteProfile,
    createAthleteProfile,
    updateAthleteProfile
  };

  return <AthleteContext.Provider value={value}>{children}</AthleteContext.Provider>;
};

export const useAthlete = () => {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error('useAthlete must be used within an AthleteProvider');
  }
  return context;
};
