
import React, { createContext, useContext, useCallback } from 'react';
import { AthleteProfile } from '@/types';
import { database } from '@/integrations/firebase/client';
import { get, ref, set, child, remove } from 'firebase/database';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { formatFirebaseAthleteProfile } from './athlete/mappers';

interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  isLoading: boolean;
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | null>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, data: Partial<AthleteProfile>) => Promise<AthleteProfile>;
  deleteAthleteProfile: (userId: string) => Promise<void>;
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [athleteProfiles, setAthleteProfiles] = React.useState<AthleteProfile[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchAthleteProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const athletesRef = ref(database, 'athletes');
      const snapshot = await get(athletesRef);

      if (snapshot.exists()) {
        const athletesData = snapshot.val();
        const formattedProfiles = Object.keys(athletesData).map(userId => {
          return formatFirebaseAthleteProfile({ userId, ...athletesData[userId] });
        });

        setAthleteProfiles(formattedProfiles);
      }
    } catch (error) {
      console.error('Error fetching athlete profiles:', error);
      toast({
        title: t('common.error'),
        description: t('athletes.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [setAthleteProfiles, t, toast]);

  React.useEffect(() => {
    fetchAthleteProfiles();
  }, [fetchAthleteProfiles]);

  const getAthleteProfile = async (userId: string): Promise<AthleteProfile | null> => {
    try {
      const cachedProfile = athleteProfiles.find(p => p.userId === userId);
      if (cachedProfile) return cachedProfile;

      const athleteRef = child(ref(database), `athletes/${userId}`);
      const snapshot = await get(athleteRef);

      if (snapshot.exists()) {
        const athleteData = snapshot.val();
        const profile = formatFirebaseAthleteProfile({ userId, ...athleteData });
        setAthleteProfiles(prev => [...prev, profile]);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching athlete profile:', error);
      return null;
    }
  };

  const createAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
    const { location, equipment, ...rest } = profile;

    try {
      const athleteData = {
        userId: rest.userId,
        name: rest.name || '',
        handedness: rest.handedness || 'right',
        height: rest.height || null,
        weight: rest.weight || null,
        level: rest.level || 'beginner',
        city: location?.city || '',
        state: location?.state || '',
        country: location?.country || '',
        bio: rest.bio || '',
        yearsPlaying: rest.yearsPlaying || 0,
        wins: rest.wins || 0,
        losses: rest.losses || 0,
        // New fields
        playingStyle: rest.playingStyle || 'all-round',
        gripStyle: rest.gripStyle || 'shakehand',
        playFrequency: rest.playFrequency || 'weekly',
        tournamentParticipation: rest.tournamentParticipation || 'never',
        club: rest.club || '',
        availableTimes: rest.availableTimes || [],
        preferredLocations: rest.preferredLocations || [],
        racket: equipment?.racket || '',
        rubbers: equipment?.rubbers || ''
      };

      await set(ref(database, `athletes/${profile.userId}`), athleteData);
      
      if (rest.role) {
        await set(ref(database, `users/${profile.userId}/role`), rest.role);
      }

      const newProfile = formatFirebaseAthleteProfile(athleteData);
      setAthleteProfiles(prev => [...prev, newProfile]);

      return newProfile;
    } catch (error) {
      console.error('Error creating athlete profile:', error);
      throw error;
    }
  };

  const updateAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
    try {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString()
      };

      if (profileData.handedness) updateData.handedness = profileData.handedness;
      if (profileData.height !== undefined) updateData.height = profileData.height;
      if (profileData.weight !== undefined) updateData.weight = profileData.weight;
      if (profileData.level) updateData.level = profileData.level;
      if (profileData.bio !== undefined) updateData.bio = profileData.bio;
      if (profileData.yearsPlaying !== undefined) updateData.yearsPlaying = profileData.yearsPlaying;
      if (profileData.wins !== undefined) updateData.wins = profileData.wins;
      if (profileData.losses !== undefined) updateData.losses = profileData.losses;
      
      if (profileData.location) {
        if (profileData.location.city) updateData.city = profileData.location.city;
        if (profileData.location.state) updateData.state = profileData.location.state;
        if (profileData.location.country) updateData.country = profileData.location.country;
      }

      // New fields
      if (profileData.playingStyle) updateData.playingStyle = profileData.playingStyle;
      if (profileData.gripStyle) updateData.gripStyle = profileData.gripStyle;
      if (profileData.playFrequency) updateData.playFrequency = profileData.playFrequency;
      if (profileData.tournamentParticipation) updateData.tournamentParticipation = profileData.tournamentParticipation;
      if (profileData.club !== undefined) updateData.club = profileData.club;
      if (profileData.availableTimes !== undefined) updateData.availableTimes = profileData.availableTimes;
      if (profileData.preferredLocations !== undefined) updateData.preferredLocations = profileData.preferredLocations;
      
      if (profileData.equipment) {
        if (profileData.equipment.racket !== undefined) updateData.racket = profileData.equipment.racket;
        if (profileData.equipment.rubbers !== undefined) updateData.rubbers = profileData.equipment.rubbers;
      }
      
      await set(ref(database, `athletes/${userId}`), updateData);

      const updatedAthleteProfile = await getAthleteProfile(userId);
      if (!updatedAthleteProfile) {
        throw new Error('Failed to fetch updated athlete profile');
      }

      setAthleteProfiles(prev => prev.map(p => p.userId === userId ? updatedAthleteProfile : p));

      return updatedAthleteProfile;
    } catch (error) {
      console.error('Error updating athlete profile:', error);
      throw error;
    }
  };

  const deleteAthleteProfile = async (userId: string): Promise<void> => {
    try {
      await remove(ref(database, `athletes/${userId}`));
      setAthleteProfiles(prev => prev.filter(p => p.userId !== userId));
    } catch (error) {
      console.error('Error deleting athlete profile:', error);
      throw error;
    }
  };

  const value = {
    athleteProfiles,
    isLoading,
    getAthleteProfile,
    createAthleteProfile,
    updateAthleteProfile,
    deleteAthleteProfile
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
