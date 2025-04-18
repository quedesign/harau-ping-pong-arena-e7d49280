
import React, { createContext, useContext, useState } from 'react';
import { Tournament, AthleteProfile, Match, TournamentFormat, Bracket } from '@/types';

// Mock data
const MOCK_ATHLETE_PROFILES: AthleteProfile[] = [
  {
    userId: '1',
    handedness: 'right',
    height: 178,
    weight: 72,
    level: 'advanced',
    location: {
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      coordinates: {
        latitude: -23.5505,
        longitude: -46.6333
      }
    },
    bio: 'Competitive player for 5 years with aggressive play style',
    yearsPlaying: 5,
    wins: 28,
    losses: 12
  },
  {
    userId: '3',
    handedness: 'left',
    height: 182,
    weight: 75,
    level: 'professional',
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'Brazil',
      coordinates: {
        latitude: -22.9068,
        longitude: -43.1729
      }
    },
    bio: 'Former national champion with defensive playing style',
    yearsPlaying: 10,
    wins: 45,
    losses: 8
  }
];

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'São Paulo Grand Slam',
    description: 'The biggest table tennis tournament in São Paulo',
    format: 'knockout',
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-05-17'),
    location: 'São Paulo Sports Center',
    entryFee: 100,
    maxParticipants: 32,
    registeredParticipants: ['1', '3'],
    createdBy: '2',
    bannerImage: '/tournament1.jpg',
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Rio Open',
    description: 'Annual championship for all skill levels',
    format: 'round-robin',
    startDate: new Date('2024-06-10'),
    endDate: new Date('2024-06-12'),
    location: 'Rio Olympic Arena',
    entryFee: 80,
    maxParticipants: 24,
    registeredParticipants: ['3'],
    createdBy: '2',
    status: 'upcoming'
  }
];

const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    tournamentId: '1',
    playerOneId: '1',
    playerTwoId: '3',
    scores: {
      playerOne: [11, 8, 11],
      playerTwo: [7, 11, 8]
    },
    winner: '1',
    scheduledTime: new Date('2024-05-15T14:00:00'),
    status: 'completed',
    location: 'São Paulo Sports Center - Table 1'
  },
  {
    id: '2',
    playerOneId: '1',
    playerTwoId: '3',
    scores: {
      playerOne: [],
      playerTwo: []
    },
    scheduledTime: new Date('2024-04-28T18:30:00'),
    status: 'scheduled',
    location: 'Rio Training Center'
  }
];

interface DataContextType {
  tournaments: Tournament[];
  athleteProfiles: AthleteProfile[];
  matches: Match[];
  // Tournament functions
  createTournament: (tournament: Omit<Tournament, 'id'>) => Promise<Tournament>;
  updateTournament: (id: string, data: Partial<Tournament>) => Promise<Tournament>;
  deleteTournament: (id: string) => Promise<void>;
  // Athlete profile functions
  getAthleteProfile: (userId: string) => AthleteProfile | undefined;
  createAthleteProfile: (profile: AthleteProfile) => Promise<AthleteProfile>;
  updateAthleteProfile: (userId: string, data: Partial<AthleteProfile>) => Promise<AthleteProfile>;
  // Match functions
  createMatch: (match: Omit<Match, 'id'>) => Promise<Match>;
  updateMatch: (id: string, data: Partial<Match>) => Promise<Match>;
  // Tournament bracket functions
  generateBracket: (tournamentId: string, seeds?: string[]) => Promise<Bracket>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS);
  const [athleteProfiles, setAthleteProfiles] = useState<AthleteProfile[]>(MOCK_ATHLETE_PROFILES);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);

  // Tournament functions
  const createTournament = async (tournament: Omit<Tournament, 'id'>): Promise<Tournament> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTournament: Tournament = {
      ...tournament,
      id: `${tournaments.length + 1}`,
    };
    
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedTournaments = tournaments.map(t => 
      t.id === id ? { ...t, ...data } : t
    );
    
    setTournaments(updatedTournaments);
    const updatedTournament = updatedTournaments.find(t => t.id === id);
    
    if (!updatedTournament) {
      throw new Error('Tournament not found');
    }
    
    return updatedTournament;
  };

  const deleteTournament = async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  // Athlete profile functions
  const getAthleteProfile = (userId: string): AthleteProfile | undefined => {
    return athleteProfiles.find(p => p.userId === userId);
  };

  const createAthleteProfile = async (profile: AthleteProfile): Promise<AthleteProfile> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAthleteProfiles(prev => [...prev, profile]);
    return profile;
  };

  const updateAthleteProfile = async (userId: string, data: Partial<AthleteProfile>): Promise<AthleteProfile> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedProfiles = athleteProfiles.map(p => 
      p.userId === userId ? { ...p, ...data } : p
    );
    
    setAthleteProfiles(updatedProfiles);
    const updatedProfile = updatedProfiles.find(p => p.userId === userId);
    
    if (!updatedProfile) {
      throw new Error('Athlete profile not found');
    }
    
    return updatedProfile;
  };

  // Match functions
  const createMatch = async (match: Omit<Match, 'id'>): Promise<Match> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMatch: Match = {
      ...match,
      id: `${matches.length + 1}`,
    };
    
    setMatches(prev => [...prev, newMatch]);
    return newMatch;
  };

  const updateMatch = async (id: string, data: Partial<Match>): Promise<Match> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedMatches = matches.map(m => 
      m.id === id ? { ...m, ...data } : m
    );
    
    setMatches(updatedMatches);
    const updatedMatch = updatedMatches.find(m => m.id === id);
    
    if (!updatedMatch) {
      throw new Error('Match not found');
    }
    
    return updatedMatch;
  };

  // Tournament bracket functions
  const generateBracket = async (tournamentId: string, seeds?: string[]): Promise<Bracket> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    
    // Get registered participants
    const participants = tournament.registeredParticipants;
    
    // Generate seeds if not provided
    const generatedSeeds = seeds || [...participants].sort(() => Math.random() - 0.5);
    
    // Create a new bracket
    const bracket: Bracket = {
      tournamentId,
      rounds: [],
      seeds: generatedSeeds.map((athleteId, index) => ({
        position: index + 1,
        athleteId
      }))
    };
    
    // For knockout tournaments, create the initial round matches
    if (tournament.format === 'knockout') {
      const firstRoundMatches: Match[] = [];
      
      // Pair athletes for first round
      for (let i = 0; i < generatedSeeds.length; i += 2) {
        if (i + 1 < generatedSeeds.length) {
          const newMatch: Match = {
            id: `${tournamentId}-r1-m${i/2+1}`,
            tournamentId,
            playerOneId: generatedSeeds[i],
            playerTwoId: generatedSeeds[i + 1],
            scores: {
              playerOne: [],
              playerTwo: []
            },
            scheduledTime: new Date(tournament.startDate),
            status: 'scheduled'
          };
          
          firstRoundMatches.push(newMatch);
        }
      }
      
      bracket.rounds.push({
        roundNumber: 1,
        matches: firstRoundMatches
      });
      
      // Add the matches to our state
      setMatches(prev => [...prev, ...firstRoundMatches]);
    }
    
    // For round-robin, create matches where each player plays against all others
    if (tournament.format === 'round-robin') {
      const roundRobinMatches: Match[] = [];
      
      for (let i = 0; i < generatedSeeds.length; i++) {
        for (let j = i + 1; j < generatedSeeds.length; j++) {
          const newMatch: Match = {
            id: `${tournamentId}-rr-${i+1}vs${j+1}`,
            tournamentId,
            playerOneId: generatedSeeds[i],
            playerTwoId: generatedSeeds[j],
            scores: {
              playerOne: [],
              playerTwo: []
            },
            scheduledTime: new Date(tournament.startDate),
            status: 'scheduled'
          };
          
          roundRobinMatches.push(newMatch);
        }
      }
      
      bracket.rounds.push({
        roundNumber: 1,
        matches: roundRobinMatches
      });
      
      // Add the matches to our state
      setMatches(prev => [...prev, ...roundRobinMatches]);
    }
    
    return bracket;
  };

  const value = {
    tournaments,
    athleteProfiles,
    matches,
    createTournament,
    updateTournament,
    deleteTournament,
    getAthleteProfile,
    createAthleteProfile,
    updateAthleteProfile,
    createMatch,
    updateMatch,
    generateBracket
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
