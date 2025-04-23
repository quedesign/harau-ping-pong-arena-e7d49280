
import { Bracket, Match } from '@/types';

export const useBracketGenerate = () => {
  const generateBracket = async (tournamentId?: string): Promise<Bracket> => {
    console.log("Tournament ID for bracket generation:", tournamentId);
    
    // Get today's date for scheduling
    const today = new Date();
    
    // Create proper Match objects with all required properties
    const mockMatches: Match[] = [
      {
        id: '1',
        playerOneId: 'p1',
        playerTwoId: 'p2',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: today,
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      },
      {
        id: '2',
        playerOneId: 'p3',
        playerTwoId: 'p4',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: today,
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      },
      {
        id: '3',
        playerOneId: 'p5',
        playerTwoId: 'p6',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: today,
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      },
      {
        id: '4',
        playerOneId: 'p7',
        playerTwoId: 'p8',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: today,
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      },
      {
        id: '5',
        playerOneId: 'TBD',
        playerTwoId: 'TBD',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      },
      {
        id: '6',
        playerOneId: 'TBD',
        playerTwoId: 'TBD',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      },
      {
        id: '7',
        playerOneId: 'TBD',
        playerTwoId: 'TBD',
        scores: { playerOne: [], playerTwo: [] },
        scheduledTime: new Date(today.getTime() + 48 * 60 * 60 * 1000), // Two days later
        status: 'scheduled',
        tournamentId: tournamentId || 'default'
      }
    ];
    
    // Create the mock bracket with properly formed Match objects
    const mockBracket: Bracket = {
      tournamentId: tournamentId || 'default',
      rounds: [
        {
          roundNumber: 1,
          matches: [mockMatches[0], mockMatches[1], mockMatches[2], mockMatches[3]]
        },
        {
          roundNumber: 2,
          matches: [mockMatches[4], mockMatches[5]]
        },
        {
          roundNumber: 3,
          matches: [mockMatches[6]]
        }
      ],
      seeds: []
    };
    
    return mockBracket;
  };

  return { generateBracket };
};
