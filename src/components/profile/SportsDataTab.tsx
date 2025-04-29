
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AthleteProfile, PlayingStyle, GripStyle, PlayFrequency, TournamentParticipation } from '@/types';
import SportsDataForm from './sports-data/SportsDataForm';
import { SportsDataFormValues } from './sports-data/schema';

interface SportsDataTabProps {
  profile: AthleteProfile | null;
  onUpdate: (data: Partial<AthleteProfile>) => void;
}

const SportsDataTab = ({ profile, onUpdate }: SportsDataTabProps) => {
  const handleSubmit = (values: SportsDataFormValues) => {
    const { availableTimesString, preferredLocationsString, ...rest } = values;
    
    // Convert form values to AthleteProfile format
    const formData: Partial<AthleteProfile> = {
      handedness: rest.handedness,
      level: rest.level,
      height: typeof rest.height === 'number' ? rest.height : undefined,
      weight: typeof rest.weight === 'number' ? rest.weight : undefined,
      bio: rest.bio,
      yearsPlaying: typeof rest.yearsPlaying === 'number' ? rest.yearsPlaying : undefined,
      playingStyle: mapPlayingStyle(rest.playingStyle),
      gripStyle: mapGripStyle(rest.gripStyle),
      playFrequency: mapPlayFrequency(rest.playFrequency),
      tournamentParticipation: rest.tournamentParticipation as TournamentParticipation,
      club: rest.club,
      location: {
        city: rest.city || '',
        state: rest.state || '',
        country: rest.country || ''
      },
      availableTimes: availableTimesString ? availableTimesString.split(',').map(s => s.trim()) : undefined,
      preferredLocations: preferredLocationsString ? preferredLocationsString.split(',').map(s => s.trim()) : undefined,
    };
    
    onUpdate(formData);
  };

  // Helper functions to map between form values and AthleteProfile types
  function mapPlayingStyle(style?: string): PlayingStyle | undefined {
    if (!style) return undefined;
    if (style === "all-round") return "all-round";
    if (style === "offensive") return "offensive";
    if (style === "defensive") return "defensive";
    return "all-round";
  }

  function mapGripStyle(style?: string): GripStyle | undefined {
    if (!style) return undefined;
    if (style === "shakehand") return "shakehand";
    if (style === "penhold") return "penhold";
    if (style === "seemiller") return "seemiller";
    return "other";
  }

  function mapPlayFrequency(freq?: string): PlayFrequency | undefined {
    if (!freq) return undefined;
    if (freq === "daily") return "daily";
    if (freq === "weekly") return "weekly";
    if (freq === "monthly") return "monthly";
    return "rarely";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Esportivos</CardTitle>
        <CardDescription>
          Atualize suas informações esportivas para encontrar parceiros de jogo compatíveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SportsDataForm profile={profile} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
};

export default SportsDataTab;
