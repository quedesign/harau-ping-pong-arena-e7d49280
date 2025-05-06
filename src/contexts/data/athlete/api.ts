
import { AthleteProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData } from './mappers';
import { SupabaseAthleteData } from './types';

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
  
  return data.map(athlete => {
    const athleteData: SupabaseAthleteData = {
      id: athlete.id,
      handedness: athlete.handedness,
      height: athlete.height,
      weight: athlete.weight,
      level: athlete.level,
      city: athlete.city,
      state: athlete.state,
      country: athlete.country,
      bio: athlete.bio,
      years_playing: athlete.years_playing,
      wins: athlete.wins,
      losses: athlete.losses,
      playing_style: athlete.playing_style,
      grip_style: athlete.grip_style,
      play_frequency: athlete.play_frequency,
      tournament_participation: athlete.tournament_participation,
      club: athlete.club,
      racket: athlete.racket,
      rubbers: athlete.rubbers,
      users: athlete.users && athlete.users[0] ? {
        name: athlete.users[0].name,
        email: athlete.users[0].email,
        profile_image: athlete.users[0].profile_image,
        created_at: athlete.users[0].created_at
      } : undefined
    };
    
    return mapSupabaseToAthleteProfile(athleteData);
  });
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
  
  const athleteData: SupabaseAthleteData = {
    id: data.id,
    handedness: data.handedness,
    height: data.height,
    weight: data.weight,
    level: data.level,
    city: data.city,
    state: data.state,
    country: data.country,
    bio: data.bio,
    years_playing: data.years_playing,
    wins: data.wins,
    losses: data.losses,
    playing_style: data.playing_style,
    grip_style: data.grip_style,
    play_frequency: data.play_frequency,
    tournament_participation: data.tournament_participation,
    club: data.club,
    racket: data.racket,
    rubbers: data.rubbers,
    users: data.users && data.users[0] ? {
      name: data.users[0].name,
      email: data.users[0].email,
      profile_image: data.users[0].profile_image,
      created_at: data.users[0].created_at
    } : undefined
  };
  
  return mapSupabaseToAthleteProfile(athleteData);
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
