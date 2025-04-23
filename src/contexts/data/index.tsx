
import React from 'react';
import { TournamentProvider, useTournament } from './TournamentContext';
import { AthleteProvider, useAthlete } from './AthleteContext';
import { MatchProvider, useMatch } from './MatchContext';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TournamentProvider>
      <AthleteProvider>
        <MatchProvider>
          {children}
        </MatchProvider>
      </AthleteProvider>
    </TournamentProvider>
  );
};

// Re-export all hooks for easy access
export { useTournament } from './TournamentContext';
export { useAthlete } from './AthleteContext';
export { useMatch } from './MatchContext';

// Export a unified hook that provides access to all data contexts
export const useData = () => {
  const tournamentContext = useTournament();
  const athleteContext = useAthlete();
  const matchContext = useMatch();
  
  return {
    // Tournament related
    tournaments: tournamentContext.tournaments,
    loading: tournamentContext.loading || athleteContext.loading || matchContext.loading,
    createTournament: tournamentContext.createTournament,
    updateTournament: tournamentContext.updateTournament,
    deleteTournament: tournamentContext.deleteTournament,
    
    // Athlete related
    athleteProfiles: athleteContext.athleteProfiles,
    getAthleteProfile: athleteContext.getAthleteProfile,
    createAthleteProfile: athleteContext.createAthleteProfile,
    updateAthleteProfile: athleteContext.updateAthleteProfile,
    
    // Match related
    matches: matchContext.matches,
    createMatch: matchContext.createMatch,
    updateMatch: matchContext.updateMatch,
    generateBracket: matchContext.generateBracket, // Added the missing function here
  };
};
