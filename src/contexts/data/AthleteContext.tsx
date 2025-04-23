import React, { createContext, useContext } from 'react';
import { AthleteProfile, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  loading: boolean;
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, data: Partial<AthleteProfile>) => Promise<AthleteProfile>;
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [athleteProfiles, setAthleteProfiles] = React.useState<AthleteProfile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAthleteProfiles();
  }, []);

  const fetchAthleteProfiles = async () => {
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
      setLoading(false);
    }
  };

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

  const value = {
    athleteProfiles,
    loading,
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
