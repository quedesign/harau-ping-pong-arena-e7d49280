
import { AthleteProfile } from '@/types';

export interface AthleteContextType {
  athleteProfiles: AthleteProfile[];
  isLoading: boolean;
  getAthleteProfile: (userId: string) => Promise<AthleteProfile | undefined>;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, profileData: Partial<AthleteProfile>) => Promise<AthleteProfile>;
  deleteAthleteProfile?: (userId: string) => Promise<void>;
}

export interface SupabaseProfileData {
  name: string;
  email: string;
  profile_image?: string | null;
  created_at: string;
}

export interface SupabaseAthleteData {
  id: string;
  user_id?: string;
  handedness?: string;
  height?: number | null;
  weight?: number | null;
  level?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string | null;
  years_playing?: number | null;
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
  profiles?: SupabaseProfileData;
  users?: {
    name: string;
    email: string;
    profile_image?: string | null;
    created_at: string;
  };
}
