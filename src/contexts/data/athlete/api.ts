import { AthleteProfile } from '@/types';
import { readData, writeData } from './../../../integrations/firebase/utils';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData } from './mappers';

export const fetchAllAthleteProfiles = async (): Promise<AthleteProfile[]> => {
  const data = await readData('athletes');

  if (!data) {
    throw new Error('No data returned from fetchAllAthleteProfiles');
  }
  
  const athleteArray = Object.entries(data).map(([userId, athleteData]) => ({
    userId,
    ...athleteData,
  })) as AthleteProfile[];
  return athleteArray;
};

export const fetchAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
  const data = await readData(`athletes/${userId}`);

  if (!data) {
    throw new Error('No data returned from fetchAthleteProfile');
  }

  return {
    userId,
    ...data,
  } as AthleteProfile;
};

export const createNewAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
  await writeData(`athletes/${profile.userId}`, profile);

  return profile;
};

export const updateExistingAthleteProfile = async (
  userId: string,
  profileData: Partial<AthleteProfile>,
): Promise<AthleteProfile> => {
  const currentProfile = await fetchAthleteProfile(userId);

  if (!currentProfile) {
    throw new Error('Athlete profile not found');
  }

  // Merge the existing profile data with the new data
  const updatedProfile = {
    ...currentProfile,
    ...profileData,
  };

  // Write the merged data back to the database
  await writeData(`athletes/${userId}`, updatedProfile);

  return updatedProfile;
};