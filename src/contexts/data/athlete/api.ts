
import { supabase } from '@/integrations/supabase/client';
import { AthleteProfile } from '@/types';
import { SupabaseAthleteData } from './types';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData, prepareUpdateData } from './mappers';

export const fetchAllAthleteProfiles = async (): Promise<AthleteProfile[]> => {
  // First, fetch profiles
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'athlete');
  
  if (profilesError) {
    throw profilesError;
  }

  // Then fetch athlete details
  const { data: athleteData, error: athleteError } = await supabase
    .from('athlete_profiles')
    .select('*');
  
  if (athleteError) {
    throw athleteError;
  }

  // Format and return the data
  const formattedProfiles: AthleteProfile[] = athleteData.map(athlete => {
    // Handle data from Supabase with potential missing fields
    const data = athlete as unknown as SupabaseAthleteData;
    return mapSupabaseToAthleteProfile(data);
  });

  return formattedProfiles;
};

export const fetchAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
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
    const athlete = data as unknown as SupabaseAthleteData;
    return mapSupabaseToAthleteProfile(athlete);
  }

  return undefined;
};

export const createNewAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
  const athleteData = mapProfileToSupabaseData(profile);
  
  const { data, error } = await supabase
    .from('athlete_profiles')
    .insert(athleteData)
    .select()
    .single();
  
  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from create');
  }

  // Convert back to app format
  return mapSupabaseToAthleteProfile(data as unknown as SupabaseAthleteData);
};

export const updateExistingAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
  const updateData = prepareUpdateData(profileData);
  
  const { data: updatedData, error } = await supabase
    .from('athlete_profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    throw error;
  }

  if (!updatedData) {
    throw new Error('No data returned from update');
  }

  // Convert back to app format
  return mapSupabaseToAthleteProfile(updatedData as unknown as SupabaseAthleteData);
};
