
import { AthleteProfile, AthleteEquipment } from '@/types';

export interface AthleteProfileHeaderProps {
  athlete: AthleteProfile;
  athleteName?: string;
}

export interface AthleteProfileCardProps {
  profile: AthleteProfile;
  athleteName?: string;
}

export interface AthleteStatsProps {
  athlete?: AthleteProfile;
  stats?: any;
  wins?: number;
  losses?: number;
}

export interface AthleteEquipmentsProps {
  athlete: AthleteProfile;
  equipment?: AthleteEquipment;
}

export interface AthleteDetailsSectionProps {
  playingStyle?: string;
  gripStyle?: string;
  playFrequency?: string;
  tournamentParticipation?: string;
  club?: string;
  height?: number;
  weight?: number;
}

export interface AthleteTournamentsProps {
  athleteId: string;
  tournaments?: any[];
}

export interface AthleteMatchesProps {
  athleteId: string;
}

export interface AthletePreferredLocationsProps {
  athlete?: AthleteProfile;
  preferredLocations?: string[];
}

export interface AthletePreferredTimesProps {
  athlete?: AthleteProfile;
  availableTimes?: string[];
}
