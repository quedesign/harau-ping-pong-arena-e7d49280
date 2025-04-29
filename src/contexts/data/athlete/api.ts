import { AthleteProfile } from '@/types';
import { SupabaseAthleteData } from './types';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData, prepareUpdateData } from './mappers';
import { supabase } from '@/integrations/supabase/client';

export const fetchAllAthleteProfiles = async (): Promise<AthleteProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) throw error;
  if (!data) throw new Error('No data returned from fetchAllAthleteProfiles');

  return data.map(mapSupabaseToAthleteProfile);
};

export const fetchAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from fetchAthleteProfile');

  return mapSupabaseToAthleteProfile(data);
};

export const createNewAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
  const supabaseData = mapProfileToSupabaseData(profile);

  const { data, error } = await supabase
    .from('profiles')
    .insert(supabaseData)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from createNewAthleteProfile');

  return mapSupabaseToAthleteProfile(data);
};

export const updateExistingAthleteProfile = async (userId: string, profileData: Partial<AthleteProfile>): Promise<AthleteProfile> => {
  const updateData = prepareUpdateData(profileData);
  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('No data returned from updateExistingAthleteProfile');

  return mapSupabaseToAthleteProfile(data);
};