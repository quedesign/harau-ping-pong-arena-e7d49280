
import { AthleteProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData } from './mappers';

export const fetchAllAthleteProfiles = async (): Promise<AthleteProfile[]> => {
  const { data, error } = await supabase
    .from('athletes')
    .select(`
      id,
      handedness,
      height,
      weight,
      level,
      city,
      state,
      country,
      bio,
      years_playing,
      wins,
      losses,
      playing_style,
      grip_style,
      play_frequency,
      tournament_participation,
      club,
      racket,
      rubbers,
      users(name, email, profile_image, created_at)
    `);

  if (error) {
    console.error('Error fetching athlete profiles:', error);
    throw error;
  }
  
  return data.map(athlete => mapSupabaseToAthleteProfile(athlete));
};

export const fetchAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
  const { data, error } = await supabase
    .from('athletes')
    .select(`
      id,
      handedness,
      height,
      weight,
      level,
      city,
      state,
      country,
      bio,
      years_playing,
      wins,
      losses,
      playing_style,
      grip_style,
      play_frequency,
      tournament_participation,
      club,
      racket,
      rubbers,
      users(name, email, profile_image, created_at)
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return undefined;
    }
    console.error('Error fetching athlete profile:', error);
    throw error;
  }
  
  return mapSupabaseToAthleteProfile(data);
};

export const createNewAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
  const supabaseData = mapProfileToSupabaseData(profile);
  
  const { data, error } = await supabase
    .from('athletes')
    .insert(supabaseData)
    .select()
    .single();

  if (error) {
    console.error('Error creating athlete profile:', error);
    throw error;
  }

  // Fetch the created profile with user data
  return await fetchAthleteProfile(profile.userId) as AthleteProfile;
};

export const updateExistingAthleteProfile = async (
  userId: string,
  profileData: Partial<AthleteProfile>,
): Promise<AthleteProfile> => {
  const supabaseData = mapProfileToSupabaseData(profileData);
  
  // Add updated_at field
  supabaseData.updated_at = new Date().toISOString();
  
  const { error } = await supabase
    .from('athletes')
    .update(supabaseData)
    .eq('id', userId);

  if (error) {
    console.error('Error updating athlete profile:', error);
    throw error;
  }

  // Fetch the updated profile
  const updatedProfile = await fetchAthleteProfile(userId);
  if (!updatedProfile) {
    throw new Error('Failed to fetch updated athlete profile');
  }

  return updatedProfile;
};
