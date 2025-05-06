
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AthleteProfile } from '@/types';
import AthleteEquipments from "./AthleteEquipments";
import AthletePreferredLocations from "./AthletePreferredLocations";
import AthletePreferredTimes from "./AthletePreferredTimes";
import AthleteProfileHeader from "./AthleteProfileHeader";
import AthleteStatsSummary from "./AthleteStatsSummary";
import AthleteDetailsSection from "./AthleteDetailsSection";

interface AthleteProfileCardProps {
  profile: AthleteProfile;
  athleteName?: string;
}

const AthleteProfileCard: React.FC<AthleteProfileCardProps> = ({
  profile,
  athleteName,
}) => {
  const displayName = athleteName || `Player ${profile.userId}`;

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800 h-fit">
        <CardContent className="p-6" >
          <AthleteProfileHeader 
            athlete={profile}
            athleteName={displayName}
          />

          <AthleteStatsSummary wins={profile.wins} losses={profile.losses} />

          <Separator className="mb-6" />
          <AthleteDetailsSection
            playingStyle={profile.playingStyle}
            gripStyle={profile.gripStyle}
            playFrequency={profile.playFrequency}
            tournamentParticipation={profile.tournamentParticipation}
            club={profile.club}
            height={profile.height}
            weight={profile.weight}
          />
        </CardContent>
      </Card>
      
      {profile.equipment && (
        <AthleteEquipments 
          equipment={profile.equipment} 
          athlete={profile} 
        />
      )}
      
      {profile.availableTimes && (
        <AthletePreferredTimes 
          availableTimes={profile.availableTimes} 
          athlete={profile} 
        />
      )}
      
      {profile.preferredLocations && (
        <AthletePreferredLocations 
          preferredLocations={profile.preferredLocations} 
          athlete={profile} 
        />
      )}
    </>
  );
};

export default AthleteProfileCard;
