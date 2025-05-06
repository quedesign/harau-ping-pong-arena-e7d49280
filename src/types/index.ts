
// Type definitions for Harau Ping Pong App

// User types
export type UserRole = 'athlete' | 'admin';

export interface User {
  id?: string; // Added id to fix issues
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
}

// Grip styles
export type GripStyle = 'shakehand' | 'penhold' | 'seemiller' | 'other';

// Playing styles
export type PlayingStyle = 'offensive' | 'defensive' | 'all-round';

// Play frequency options
export type PlayFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely';

// Tournament participation
export type TournamentParticipation = 'never' | 'local' | 'regional' | 'national' | 'international';

// Equipment type
export interface AthleteEquipment {
  racket?: string;
  rubbers?: string;
}

// Athlete specific profile
export interface AthleteProfile {
  userId: string;
  name?: string; // Added name to fix issues
  handedness: 'left' | 'right' | 'ambidextrous';
  height?: number; // in cm
  weight?: number; // in kg
  level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  bio?: string;
  yearsPlaying?: number;
  wins: number;
  losses: number;
  
  // New fields for sports data
  playingStyle?: PlayingStyle;
  gripStyle?: GripStyle;
  playFrequency?: PlayFrequency;
  tournamentParticipation?: TournamentParticipation;
  club?: string;
  availableTimes?: string[];
  preferredLocations?: string[];
  
  // Equipment information
  equipment?: AthleteEquipment;
}

// For RecentAthletes component
export interface Athlete {
  id: string;
  name: string;
  level?: string;
  location?: {
    city: string;
    country: string;
  };
  playingStyle?: string;
}

// Tournament types
export type TournamentFormat = 'knockout' | 'round-robin';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  startDate: Date;
  endDate: Date;
  location: string;
  entryFee: number;
  maxParticipants: number;
  registeredParticipants: string[]; // array of athlete IDs
  createdBy: string; // admin ID
  bannerImage?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  pixKey?: string; // New field for PIX payments
}

// Match types
export interface Match {
  id: string;
  tournamentId?: string; // Optional: null for friendly matches
  playerOneId: string;
  playerTwoId: string;
  scores: {
    playerOne: number[];
    playerTwo: number[];
  };
  winner?: string; // ID of winning player
  scheduledTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string;
}

// Bracket/Seed types
export interface Seed {
  position: number;
  athleteId: string;
}

export interface Bracket {
  tournamentId: string;
  rounds: {
    roundNumber: number;
    matches: Match[];
  }[];
  seeds: Seed[];
}

// Extend the existing AuthContextType
export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, callback?: (user: User) => void) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  createTestUser: () => Promise<void>;
  setError?: (error: string | null) => void;
  loginWithGoogle?: (callback?: (user: User) => void) => Promise<void>;
}

// For useLogin hook
export type UseLogin = (email: string, password: string, callback?: (user: User) => void) => Promise<boolean>;
