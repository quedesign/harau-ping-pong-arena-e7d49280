
// Type definitions for Harau Ping Pong App

// User types
export type UserRole = 'athlete' | 'admin';

export interface User {
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

// Athlete specific profile
export interface AthleteProfile {
  userId: string;
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
  equipment?: {
    racket?: string;
    rubbers?: string;
  };
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
  // ... keep existing properties
  createTestUser?: () => Promise<boolean>;
}
