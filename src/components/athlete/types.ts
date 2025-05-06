
import { AthleteProfile } from '@/types';

export interface AthleteProfileHeaderProps {
  athlete: AthleteProfile;
}

export interface AthleteProfileCardProps {
  athlete: AthleteProfile;
}

export interface AthleteStatsProps {
  athlete: AthleteProfile;
}

export interface AthleteEquipmentsProps {
  athlete: AthleteProfile;
  equipment?: any;
}

export interface AthleteDetailsSectionProps {
  athlete: AthleteProfile;
}

export interface AthleteTournamentsProps {
  athleteId: string;
  tournaments?: any[];
}

export interface AthleteMatchesProps {
  athleteId: string;
}

export interface AthletePreferredLocationsProps {
  athlete: AthleteProfile;
  preferredLocations?: string[];
}

export interface AthletePreferredTimesProps {
  athlete: AthleteProfile;
  availableTimes?: string[];
}
