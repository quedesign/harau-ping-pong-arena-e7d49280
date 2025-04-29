
import { AthleteProfile } from '@/types';
import { SupabaseAthleteData } from './types';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData } from './mappers';
import { 
  getAllAthleteProfiles as getLocalAthletes, 
  getAthleteProfile as getLocalAthleteProfile,
  createAthleteProfile as createLocalAthleteProfile,
  updateAthleteProfile as updateLocalAthleteProfile
} from '@/services/localAthleteData';

// Função para simular o comportamento assíncrono
const simulateAsync = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), 300);
  });
};

export const fetchAllAthleteProfiles = async (): Promise<AthleteProfile[]> => {
  const profiles = getLocalAthletes();
  return simulateAsync(profiles);
};

export const fetchAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
  const profile = getLocalAthleteProfile(userId);
  return simulateAsync(profile);
};

export const createNewAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
  const newProfile = createLocalAthleteProfile(profile);
  return simulateAsync(newProfile);
};

export const updateExistingAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
  const updatedProfile = updateLocalAthleteProfile(userId, profileData);
  return simulateAsync(updatedProfile);
};
