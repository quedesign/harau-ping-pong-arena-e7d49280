
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AthleteProfile } from '@/types';
import { AthleteContextType } from './types';
import { 
  fetchAllAthleteProfiles, 
  fetchAthleteProfile, 
  createNewAthleteProfile, 
  updateExistingAthleteProfile 
} from './api';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

// Create context with undefined initial value
const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [athleteProfiles, setAthleteProfiles] = useState<AthleteProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all athlete profiles on mount
  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      try {
        const profiles = await fetchAllAthleteProfiles();
        setAthleteProfiles(profiles);
      } catch (error) {
        console.error('Error fetching athlete profiles:', error);
        toast({
          title: t('common.error'),
          description: t('athletes.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [t]);

  // Get a specific athlete profile
  const getAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
    try {
      // First check if we already have it in state
      const cachedProfile = athleteProfiles.find(p => p.userId === userId);
      if (cachedProfile) return cachedProfile;
      
      // Fetch from Supabase
      const profile = await fetchAthleteProfile(userId);
      
      // Add to local state if found
      if (profile) {
        setAthleteProfiles(prev => [...prev, profile]);
      }
      
      return profile;
    } catch (error) {
      console.error('Error fetching athlete profile:', error);
      return undefined;
    }
  };

  // Create a new athlete profile
  const createAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
    try {
      const newProfile = await createNewAthleteProfile(profile);
      
      // Update local state
      setAthleteProfiles(prev => [...prev, newProfile]);
      
      return newProfile;
    } catch (error) {
      console.error('Error creating athlete profile:', error);
      throw error;
    }
  };

  // Update an existing athlete profile
  const updateAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
    try {
      const profile = await updateExistingAthleteProfile(userId, profileData);
      
      // Update local state
      setAthleteProfiles(prev => prev.map(p => p.userId === userId ? profile : p));
      
      return profile;
    } catch (error) {
      console.error('Error updating athlete profile:', error);
      throw error;
    }
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
