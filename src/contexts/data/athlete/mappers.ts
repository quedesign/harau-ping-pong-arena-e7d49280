
import { AthleteProfile } from '@/types';

export interface SupabaseAthleteData {
  id: string;
  handedness?: string;
  height?: number;
  weight?: number;
  level?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  years_playing?: number;
  wins?: number;
  losses?: number;
  playing_style?: string;
  grip_style?: string;
  play_frequency?: string;
  tournament_participation?: string;
  club?: string;
  racket?: string;
  rubbers?: string;
  created_at?: string;
  updated_at?: string;
  users?: {
    name: string;
    email: string;
    profile_image?: string;
    created_at: string;
  };
}

export const mapSupabaseToAthleteProfile = (data: SupabaseAthleteData): AthleteProfile => {
  return {
    userId: data.id,
    name: data.users?.name || '',
    email: data.users?.email || '',
    handedness: data.handedness as 'left' | 'right' | 'ambidextrous',
    height: data.height,
    weight: data.weight,
    level: data.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
    location: {
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
    },
    bio: data.bio,
    yearsPlaying: data.years_playing,
    wins: data.wins || 0,
    losses: data.losses || 0,
    playingStyle: data.playing_style as 'offensive' | 'defensive' | 'all-round',
    gripStyle: data.grip_style as 'shakehand' | 'penhold' | 'seemiller' | 'other',
    playFrequency: data.play_frequency as 'daily' | 'weekly' | 'monthly' | 'rarely',
    tournamentParticipation: data.tournament_participation as 'never' | 'local' | 'regional' | 'national' | 'international',
    club: data.club,
    equipment: {
      racket: data.racket,
      rubbers: data.rubbers,
    },
    createdAt: data.created_at ? new Date(data.created_at) : new Date(),
  };
};

export const mapProfileToSupabaseData = (profile: Partial<AthleteProfile>): any => {
  const result: any = {};
  
  if (profile.userId) result.id = profile.userId;
  if (profile.handedness !== undefined) result.handedness = profile.handedness;
  if (profile.height !== undefined) result.height = profile.height;
  if (profile.weight !== undefined) result.weight = profile.weight;
  if (profile.level !== undefined) result.level = profile.level;
  if (profile.bio !== undefined) result.bio = profile.bio;
  if (profile.yearsPlaying !== undefined) result.years_playing = profile.yearsPlaying;
  if (profile.wins !== undefined) result.wins = profile.wins;
  if (profile.losses !== undefined) result.losses = profile.losses;
  if (profile.playingStyle !== undefined) result.playing_style = profile.playingStyle;
  if (profile.gripStyle !== undefined) result.grip_style = profile.gripStyle;
  if (profile.playFrequency !== undefined) result.play_frequency = profile.playFrequency;
  if (profile.tournamentParticipation !== undefined) result.tournament_participation = profile.tournamentParticipation;
  if (profile.club !== undefined) result.club = profile.club;
  
  if (profile.location) {
    if (profile.location.city !== undefined) result.city = profile.location.city;
    if (profile.location.state !== undefined) result.state = profile.location.state;
    if (profile.location.country !== undefined) result.country = profile.location.country;
  }
  
  if (profile.equipment) {
    if (profile.equipment.racket !== undefined) result.racket = profile.equipment.racket;
    if (profile.equipment.rubbers !== undefined) result.rubbers = profile.equipment.rubbers;
  }
  
  return result;
};

export const formatFirebaseAthleteProfile = (data: any): AthleteProfile => {
  // Legacy mapper function maintained for compatibility
  return {
    userId: data.userId,
    name: data.name || '',
    email: data.email || '',
    handedness: data.handedness as 'left' | 'right' | 'ambidextrous',
    height: data.height,
    weight: data.weight,
    level: data.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
    location: {
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
    },
    bio: data.bio,
    yearsPlaying: data.years_playing,
    wins: data.wins || 0,
    losses: data.losses || 0,
    playingStyle: data.playing_style as 'offensive' | 'defensive' | 'all-round',
    gripStyle: data.grip_style as 'shakehand' | 'penhold' | 'seemiller' | 'other',
    playFrequency: data.play_frequency as 'daily' | 'weekly' | 'monthly' | 'rarely',
    tournamentParticipation: data.tournament_participation as 'never' | 'local' | 'regional' | 'national' | 'international',
    club: data.club,
    equipment: {
      racket: data.racket,
      rubbers: data.rubbers,
    },
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
  };
};

export const mapFirebaseAthleteToAthlete = (athlete: any): AthleteProfile => {
  // Legacy mapper function maintained for compatibility
  return formatFirebaseAthleteProfile(athlete);
};
