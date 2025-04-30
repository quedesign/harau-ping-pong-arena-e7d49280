
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AthleteProfile } from "@/types";
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

const AthleteProfileCard: React.FC<AthleteProfileCardProps> = ({ profile, athleteName }) => {
  const displayName = athleteName || `Player ${profile.userId}`;
  
  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800 h-fit">
        <CardContent className="p-6">
          <AthleteProfileHeader 
            athleteName={displayName}
            location={profile.location}
            level={profile.level}
            handedness={profile.handedness}
            yearsPlaying={profile.yearsPlaying}
          />

          <AthleteStatsSummary wins={profile.wins} losses={profile.losses} />

          <Separator className="mb-6" />

<<<<<<< HEAD
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge
                variant="outline"
                className="bg-zinc-800 border-zinc-700"
              >
                {formatLevel(profile.level)}
              </Badge>

              <Badge
                variant="outline"
                className="bg-zinc-800 border-zinc-700"
                >{formatHandedness(profile.handedness)}
              </Badge>
              {profile.yearsPlaying && (
                <Badge
                  variant="outline"
                  className="bg-zinc-800 border-zinc-700"
                >
                  {profile.yearsPlaying}{" "}
                  {profile.yearsPlaying === 1 ? "ano" : "anos"} de experiência
                </Badge>
              )}
            </div>

              <div className="w-full grid grid-cols-3 gap-2 text-center mb-6">
                <div className="bg-black p-3 rounded-md">
                  <p className="text-primary text-xl font-bold">{profile.wins}</p>
                  <p className="text-xs text-zinc-400">Vitórias</p>
                </div>
                <div className="bg-black p-3 rounded-md">
                  <p className="text-zinc-400 text-xl font-bold">
                    {profile.losses}
                  </p>
                  <p className="text-xs text-zinc-400">Derrotas</p>
                </div>
                <div className="bg-black p-3 rounded-md">
                  <p className="text-lg font-bold">
                    {profile.wins + profile.losses > 0
                      ? Math.round(
                          (profile.wins / (profile.wins + profile.losses)) * 100
                        )
                      : 0}
                    <span className="text-xs">%</span>
                  </p>
                  <p className="text-xs text-zinc-400">Win Rate</p>
                </div>
              </div>

              <Separator className="mb-6" />

            <div className="w-full space-y-4">
              {profile.playingStyle && (
                <div className="flex items-center gap-2" >
                  <Swords size={16} className="text-zinc-400"/>
                  <span className="text-zinc-400">
                    Estilo de jogo:</span>
                  <span className="ml-auto">
                    {formatPlayingStyle(profile.playingStyle)}
                  </span>
                </div>
                )}
              
              {profile.gripStyle && (
                <div className="flex items-center gap-2">
                <Award size={16} className="text-zinc-400" />
                <span className="text-zinc-400">Empunhadura:</span>
                <span className="ml-auto">
                  {profile.gripStyle === "classic" ? "Clássica" : profile.gripStyle === "penhold" ? "Caneta" : "Outras"}
                </span>
                </div>
              )}

              {profile.playFrequency &&(
                <div className="flex items-center gap-2">
                <Timer size={16} className="text-zinc-400" />
                <span className="text-zinc-400">Frequência:</span>
                <span className="ml-auto">
                  {profile.playFrequency === "once-a-week" ? "1x por semana" :
                  profile.playFrequency === "twice-or-more" ? "2x ou mais" : 
                  profile.playFrequency === "weekends-only" ? "Fins de semana" : 
                  profile.playFrequency === "monthly" ? "Mensalmente" : "Raramente"}
                </span>
              </div>
              )}

              {profile.tournamentParticipation &&(
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-zinc-400" />
                  <span className="text-zinc-400">Torneios:</span>
                  <span className="ml-auto">
                    {profile.tournamentParticipation === "yes"
                     ? "Participa"
                     : profile.tournamentParticipation === "no"
                     ? "Não participa"                  
                      : "Ocasionalmente"}
                  </span>                 
                </div>
              )}

                {profile.club && (
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Clube:</span>
                    <span className="ml-auto">{profile.club}</span>
                  </div>
                )}

                {profile.height && (
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Altura:</span>
                    <span className="ml-auto">{profile.height} cm</span>
                  </div> 
                )}
              {profile.weight && (
                <div className="flex items-center gap-2">
                  <CircleUser size={16} className="text-zinc-400" />
                  <span className="text-zinc-400">Peso:</span>
                  <span className="ml-auto">{profile.weight} kg</span>
                </div>
              )}           
            </div>
          </div>
=======
          <AthleteDetailsSection 
            playingStyle={profile.playingStyle}
            gripStyle={profile.gripStyle}
            playFrequency={profile.playFrequency}
            tournamentParticipation={profile.tournamentParticipation}
            club={profile.club}
            height={profile.height}
            weight={profile.weight}
          />
>>>>>>> f00ede0155558201e980f2bbbe8083a73f82f4e4
        </CardContent>
      </Card>
      
      {profile.equipment && <AthleteEquipments equipment={profile.equipment} />}
      {profile.availableTimes && <AthletePreferredTimes availableTimes={profile.availableTimes} />}
      {profile.preferredLocations && <AthletePreferredLocations preferredLocations={profile.preferredLocations} />}
    </>
  );
};

export default AthleteProfileCard;
