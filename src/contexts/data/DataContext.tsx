
import React from 'react';
import { TournamentProvider } from './TournamentContext';
import { AthleteProvider } from './AthleteContext';
import { MatchProvider } from './MatchContext';

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

export { useTournament } from './TournamentContext';
export { useAthlete } from './AthleteContext';
export { useMatch } from './MatchContext';
