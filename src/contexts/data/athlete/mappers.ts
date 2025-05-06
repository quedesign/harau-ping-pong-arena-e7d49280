
import { AthleteProfile } from '@/types';
import { SupabaseAthleteData } from './types';

export const mapSupabaseToAthleteProfile = (data: SupabaseAthleteData): AthleteProfile => {
  return {
    userId: data.id,
    name: data.users?.name,
    email: data.users?.email,
    handedness: (data.handedness || 'right') as 'left' | 'right' | 'ambidextrous',
    height: data.height ?? undefined,
    weight: data.weight ?? undefined,
    level: (data.level || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'professional',
    location: {
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
    },
    bio: data.bio ?? undefined,
    yearsPlaying: data.years_playing ?? undefined,
    wins: data.wins || 0,
    losses: data.losses || 0,
    profileImage: data.users?.profile_image ?? undefined, // Convert null to undefined explicitly
    createdAt: data.users?.created_at ? new Date(data.users.created_at) : undefined,
    playingStyle: data.playing_style as any,
    gripStyle: data.grip_style as any,
    playFrequency: data.play_frequency as any,
    tournamentParticipation: data.tournament_participation as any,
    club: data.club,
    equipment: {
      racket: data.racket,
      rubbers: data.rubbers
    }
  };
};

export const mapProfileToSupabaseData = (profile: Partial<AthleteProfile>): any => {
  const result: any = {};
  
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
