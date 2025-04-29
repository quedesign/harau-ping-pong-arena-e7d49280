
import { AthleteProfile } from '@/types';

// Define the interface for our Supabase data
export interface SupabaseAthleteData {
  user_id: string;
  handedness: string;
  height: number | null;
  weight: number | null;
  level: string;
  city: string;
  state: string;
  country: string;
  bio: string | null;
  years_playing: number | null;
  wins: number;
  losses: number;
  updated_at: string;
  created_at: string;
  // New fields that might not exist in the DB yet
  playing_style?: string;
  grip_style?: string;
  play_frequency?: string;
  tournament_participation?: string;
  club?: string;
  available_times?: string[];
  preferred_locations?: string[];
  racket?: string;
  rubbers?: string;
}

export interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  loading: boolean;
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, data: Partial<AthleteProfile>) => Promise<AthleteProfile>;
}
