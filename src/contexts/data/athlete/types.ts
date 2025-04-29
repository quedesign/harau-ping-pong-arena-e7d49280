
// Add any missing imports and exports from the original file

import { AthleteProfile } from '@/types';

export interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  loading: boolean;
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, profileData: Partial<AthleteProfile>) => Promise<AthleteProfile>;
}

export interface SupabaseAthleteData {
  user_id: string;
  handedness: string;
  height?: number;
  weight?: number;
  level: string;
  city: string;
  state: string;
  country: string;
  bio?: string;
  years_playing?: number;
  wins: number;
  losses: number;
  created_at: string;
  updated_at: string;
  
  // Additional fields that align with our types
  playing_style?: string;
  grip_style?: string;
  play_frequency?: string;
  tournament_participation?: string;
  club?: string;
  available_times?: string[];
  preferred_locations?: string[];
  racket?: string;
  rubbers?: string;
  equipment?: {
    racket?: string;
    rubbers?: string;
  };
}
