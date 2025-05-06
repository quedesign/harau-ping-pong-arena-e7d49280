
import { AthleteProfile } from '@/types';

export interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  isLoading: boolean;
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, profileData: Partial<AthleteProfile>) => Promise<AthleteProfile>;
  deleteAthleteProfile?: (userId: string) => Promise<void>;
}

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
    profile_image?: string | null; // Updated to accept both null and undefined
    created_at: string;
  };
}
