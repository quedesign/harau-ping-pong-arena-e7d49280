
import { AthleteProfile } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { mapSupabaseToAthleteProfile, mapProfileToSupabaseData } from './mappers';
import { SupabaseAthleteData, SupabaseProfileData } from './types';

export const fetchAllAthleteProfiles = async (): Promise<AthleteProfile[]> => {
  const { data, error } = await supabase
    .from('athlete_profiles')
    .select(`
      user_id,
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
      profiles(name, email, profile_image, created_at)
    `);

  if (error) {
    console.error('Error fetching athlete profiles:', error);
    throw error;
  }
  
  return (data as any[]).map(athlete => {
    // Correctly access the nested profiles object
    const profileData = athlete.profiles as SupabaseProfileData;
    
    const athleteData: SupabaseAthleteData = {
      id: athlete.user_id,
      handedness: athlete.handedness,
      height: athlete.height || undefined,
      weight: athlete.weight || undefined,
      level: athlete.level,
      city: athlete.city,
      state: athlete.state,
      country: athlete.country,
      bio: athlete.bio || undefined,
      years_playing: athlete.years_playing || undefined,
      wins: athlete.wins,
      losses: athlete.losses,
      users: profileData ? {
        name: profileData.name,
        email: profileData.email,
        profile_image: profileData.profile_image || undefined, // Convert null to undefined
        created_at: profileData.created_at
      } : undefined
    };
    
    return mapSupabaseToAthleteProfile(athleteData);
  });
};

export const fetchAthleteProfile = async (userId: string): Promise<AthleteProfile | undefined> => {
  const { data, error } = await supabase
    .from('athlete_profiles')
    .select(`
      user_id,
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
      profiles(name, email, profile_image, created_at)
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return undefined;
    }
    console.error('Error fetching athlete profile:', error);
    throw error;
  }
  
  // Fix: The profiles property might be an object, not an array
  // Let's check its structure and handle accordingly
  const profileData = data.profiles ? 
    // If it's already in the expected shape, use it directly
    (typeof data.profiles === 'object' && !Array.isArray(data.profiles) ? 
      data.profiles as SupabaseProfileData : 
      // If it's an array with one item, take the first item
      Array.isArray(data.profiles) && data.profiles.length > 0 ? 
        data.profiles[0] as SupabaseProfileData : 
        undefined) : 
    undefined;
  
  const athleteData: SupabaseAthleteData = {
    id: data.user_id,
    handedness: data.handedness,
    height: data.height || undefined,
    weight: data.weight || undefined,
    level: data.level,
    city: data.city,
    state: data.state,
    country: data.country,
    bio: data.bio || undefined,
    years_playing: data.years_playing || undefined,
    wins: data.wins,
    losses: data.losses,
    users: profileData ? {
      name: profileData.name,
      email: profileData.email,
      profile_image: profileData.profile_image || undefined, // Convert null to undefined
      created_at: profileData.created_at
    } : undefined
  };
  
  return mapSupabaseToAthleteProfile(athleteData);
};

export const createNewAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
  const supabaseData = mapProfileToSupabaseData(profile);
  
  const { data, error } = await supabase
    .from('athlete_profiles')
    .insert({
      user_id: profile.userId,
      handedness: supabaseData.handedness,
      height: supabaseData.height,
      weight: supabaseData.weight, 
      level: supabaseData.level,
      city: supabaseData.city,
      state: supabaseData.state,
      country: supabaseData.country,
      bio: supabaseData.bio,
      years_playing: supabaseData.years_playing,
      wins: supabaseData.wins,
      losses: supabaseData.losses
    })
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
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  // Only include fields that are present in profileData
  if (profileData.handedness) updateData.handedness = supabaseData.handedness;
  if (profileData.height !== undefined) updateData.height = supabaseData.height;
  if (profileData.weight !== undefined) updateData.weight = supabaseData.weight;
  if (profileData.level) updateData.level = supabaseData.level;
  if (profileData.bio !== undefined) updateData.bio = supabaseData.bio;
  if (profileData.yearsPlaying !== undefined) updateData.years_playing = supabaseData.years_playing;
  if (profileData.wins !== undefined) updateData.wins = supabaseData.wins;
  if (profileData.losses !== undefined) updateData.losses = supabaseData.losses;

  if (profileData.location) {
    if (profileData.location.city) updateData.city = supabaseData.city;
    if (profileData.location.state) updateData.state = supabaseData.state;
    if (profileData.location.country) updateData.country = supabaseData.country;
  }
  
  const { error } = await supabase
    .from('athlete_profiles')
    .update(updateData)
    .eq('user_id', userId);

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
