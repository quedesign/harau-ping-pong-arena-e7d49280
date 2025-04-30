
import { AthleteProfile, PlayingStyle, GripStyle, PlayFrequency, TournamentParticipation } from '@/types';
import { SupabaseAthleteData } from './types';

// Converter dados do Supabase para o formato do app
export const mapSupabaseToAthleteProfile = (data: SupabaseAthleteData): AthleteProfile => {
  return {
    userId: data.user_id,
    handedness: data.handedness as 'left' | 'right' | 'ambidextrous',
    height: data.height,
    weight: data.weight,
    level: data.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
    location: {
      city: data.city,
      state: data.state,
      country: data.country,
    },
    bio: data.bio,
    yearsPlaying: data.years_playing,
    wins: data.wins,
    losses: data.losses,
    // Campos novos - acessar propriedades opcionais com segurança
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

// Converter formato do app para dados do Supabase
export const mapProfileToSupabaseData = (profile: AthleteProfile) => {
  const { location, equipment, ...rest } = profile;
  
  // Preparar dados para o Supabase
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
    // Campos novos
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

// Preparar dados para atualização no Supabase
export const prepareUpdateData = (profileData: Partial<AthleteProfile>): {
  updated_at: string;
  [key: string]: unknown;
} => {
  type UpdateData = { [key: string]: unknown; updated_at: string };

  const updateData: UpdateData = { updated_at: new Date().toISOString() };
  
  if (profileData.handedness) updateData.handedness = profileData.handedness;
  if (profileData.height !== undefined) updateData.height = profileData.height;
  if (profileData.weight !== undefined) updateData.weight = profileData.weight;
  if (profileData.level) updateData.level = profileData.level;
  if (profileData.bio !== undefined) updateData.bio = profileData.bio;
  if (profileData.yearsPlaying !== undefined) updateData.years_playing = profileData.yearsPlaying;
  if (profileData.wins !== undefined) updateData.wins = profileData.wins;
  if (profileData.losses !== undefined) updateData.losses = profileData.losses;
  
  if (profileData.location) {
    if (profileData.location.city !== undefined) updateData.city = profileData.location.city;
    if (profileData.location.state !== undefined) updateData.state = profileData.location.state;
    if (profileData.location.country !== undefined) updateData.country = profileData.location.country;
  }

  // Campos novos
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
