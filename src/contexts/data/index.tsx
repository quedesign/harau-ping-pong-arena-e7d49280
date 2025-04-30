
import React, { useContext } from 'react';
import { TournamentProvider, useTournament } from './TournamentContext';
import { AthleteProvider, useAthlete } from './athlete';
import { DataContext } from './utils';
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
export { useAthlete } from './athlete';
export { useMatch } from './MatchContext';

// Custom hook to provide all data contexts
export const useData = () => {
    const tournamentContext = useTournament();
    const athleteContext = useAthlete();
    const matchContext = useMatch();

    return {
        // Tournament related
        ...tournamentContext,
        // Athlete related
        ...athleteContext,
        // Match related
        ...matchContext,
        loading: tournamentContext.loading || athleteContext.loading || matchContext.loading,
    };
};


