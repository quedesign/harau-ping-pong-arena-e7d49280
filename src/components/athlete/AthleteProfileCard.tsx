import { MapPin, Award, Swords, Timer, Trophy, BadgeCheck, User, CircleUser } from "lucide-react";
import AthletePreferredLocations from "./AthletePreferredLocations";
import AthletePreferredTimes from "./AthletePreferredTimes";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AthleteEquipments from './AthleteEquipments';
import { Separator } from '@/components/ui/separator';
import { AthleteProfile } from '@/types';

interface AthleteProfileCardProps {
  profile: AthleteProfile;
}

const formatLevel = (level: string): string => {
  switch (level) {
    case "beginner":
      return "Iniciante";
    case "intermediate":
      return "Intermediário";
    case "advanced":
      return "Avançado";
    default:
      return "Competidor federado";
  }
};

const formatHandedness = (handedness: string): string => {
  switch (handedness) {
    case "right":
      return "Destro";
    case "left":
      return "Canhoto";
    default:
      return "Ambidestro";
  }
};

const formatPlayingStyle = (playingStyle: string): string => {
  switch (playingStyle) {
    case "offensive":
      return "Ofensivo";
    case "defensive":
      return "Defensivo";
    case "all-around":
      return "All-around";
    default:
      return playingStyle;
  }
}

const AthleteProfileCard: React.FC<AthleteProfileCardProps> = ({ profile }) => {
    const athleteName = `Player ${profile.userId}`;
    return (<>
          <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white mb-4">
              <span className="text-3xl font-semibold">
                {athleteName.charAt(0)}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-1">{athleteName}</h2>
            <p className="text-zinc-400 text-sm flex items-center mb-4">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {profile.location.city}, {profile.location.country}
            </p>

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
                    Estilo de jogo:
                  </span>
                  <span className="ml-auto">
                    {formatPlayingStyle(profile.playingStyle)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Empunhadura:</span>
                    <span className="ml-auto">
                    {profile.gripStyle === "classic" ? "Clássica" : profile.gripStyle === "penhold" ? "Caneta" : "Outras"}
                    </span>
                </div>}
                </div>
                )}
                {profile.gripStyle && (
                <div className="flex items-center gap-2">
                  <Timer size={16} className="text-zinc-400" />
                  <span className="text-zinc-400">Frequência:</span>
                  <span className="ml-auto">
                    {profile.playFrequency === "once-a-week"
                      ? "1x por semana"
                      : profile.playFrequency === "twice-or-more"
                      ? "2x ou mais"
                      : profile.playFrequency === "weekends-only"
                      ? "Fins de semana"
                      : profile.playFrequency === "monthly"
                      ? "Mensalmente"
                      : "Raramente"}
                  </span>
                </div>
                )}
              )}

              {profile.tournamentParticipation && (
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-zinc-400" />
                  <span className="text-zinc-400">Torneios:</span>
                  <span className="ml-auto">
                    {profile.tournamentParticipation === "yes"
                     ? "Participa"
                     : profile.tournamentParticipation === "no"
                     ? "Não participa"
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
        </CardContent>
          </Card>
      {profile.equipment && <AthleteEquipments equipment={profile.equipment} />}
      {profile.availableTimes && <AthletePreferredTimes availableTimes={profile.availableTimes} />}
      {profile.preferredLocations && (<AthletePreferredLocations preferredLocations={profile.preferredLocations} />)}
      </>
    );
};

export default AthleteProfileCard;
