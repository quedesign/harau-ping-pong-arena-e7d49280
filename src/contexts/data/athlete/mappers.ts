
import { AthleteProfile, PlayingStyle, GripStyle, PlayFrequency, TournamentParticipation } from '@/types';
import { SupabaseAthleteData } from './types';

// Convert Supabase data to app format
export const mapSupabaseToAthleteProfile = (data: SupabaseAthleteData): AthleteProfile => {
  return {
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
    losses: data.losses,
    // New fields - safely access optional properties
    playingStyle: data.playing_style as PlayingStyle | undefined,
    gripStyle: data.grip_style as GripStyle | undefined,
    playFrequency: data.play_frequency as PlayFrequency | undefined,
    tournamentParticipation: data.tournament_participation as TournamentParticipation | undefined,
    club: data.club,
    availableTimes: data.available_times || [],
    preferredLocations: data.preferred_locations || [],
    equipment: {
      racket: data.racket,
      rubbers: data.rubbers
    }
  };
};

// Convert app format to Supabase data
export const mapProfileToSupabaseData = (profile: AthleteProfile) => {
  const { location, equipment, ...rest } = profile;
  
  // Prepare data for Supabase
  return {
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
    losses: rest.losses,
    // New fields
    playing_style: rest.playingStyle,
    grip_style: rest.gripStyle,
    play_frequency: rest.playFrequency,
    tournament_participation: rest.tournamentParticipation,
    club: rest.club,
    available_times: rest.availableTimes,
    preferred_locations: rest.preferredLocations,
    racket: equipment?.racket,
    rubbers: equipment?.rubbers
  };
};

// Prepare update data for Supabase
export const prepareUpdateData = (profileData: Partial<AthleteProfile>) => {
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

  // New fields
  if (profileData.playingStyle !== undefined) updateData.playing_style = profileData.playingStyle;
  if (profileData.gripStyle !== undefined) updateData.grip_style = profileData.gripStyle;
  if (profileData.playFrequency !== undefined) updateData.play_frequency = profileData.playFrequency;
  if (profileData.tournamentParticipation !== undefined) updateData.tournament_participation = profileData.tournamentParticipation;
  if (profileData.club !== undefined) updateData.club = profileData.club;
  if (profileData.availableTimes !== undefined) updateData.available_times = profileData.availableTimes;
  if (profileData.preferredLocations !== undefined) updateData.preferred_locations = profileData.preferredLocations;
  
  if (profileData.equipment) {
    if (profileData.equipment.racket !== undefined) updateData.racket = profileData.equipment.racket;
    if (profileData.equipment.rubbers !== undefined) updateData.rubbers = profileData.equipment.rubbers;
  }
  
  return updateData;
};
